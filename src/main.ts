require('dotenv').config();

import * as basicAuth from 'express-basic-auth';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import appConfig from './config/app.config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { ContextInterceptor } from './context.interceptor';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
    const appConf = appConfig();
    const httpPort = appConf.appHttpPort || 3000;
    const httpsPort = appConf.appHttpsPort || 0;
    const server = express();
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
        {
            cors: {
                origin: [
                    'http://account.skymetric.kz',
                    'http://skymetric.kz',
                    'https://account.skymetric.kz',
                    'https://skymetric.kz',
                    'https://kaspi.kz',
                    'http://localhost:' + httpPort,
                    'http://127.0.0.1:' + httpPort,
                ],
            },
        },
    );
    app.use(
        ['/docs'],
        basicAuth({
            challenge: true,
            users: {
                [appConf.appDocUser.username]: appConf.appDocUser.password,
            },
        }),
    );
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalInterceptors(new ContextInterceptor());
    const config = new DocumentBuilder()
        .setTitle('SkyMetric: REST Api')
        .setDescription('')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    //await app.init();

    await app.listen(httpPort, () =>
        console.log('Server started on port ' + httpPort),
    );
    /*
    http.createServer(server).listen(httpPort);
    if (httpsPort) {
        const httpsOptions = {
            key: fs.readFileSync(appConf.appCertificate.key),
            cert: fs.readFileSync(appConf.appCertificate.cert),
        };
        https.createServer(httpsOptions, server).listen(httpsPort);
    }
    */
}

bootstrap();

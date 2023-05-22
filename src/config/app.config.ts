let conf;

export default (): {
    appSecret: string;
    appHttpPort: number;
    appHttpsPort: number;
    appCertificate: { key: string; cert: string };
    appDocUser: { username: string; password: string };
} => {
    if (!conf) {
        conf = {
            appHttpPort: parseInt(process.env.APP_HTTP_PORT) || 3000,
            appHttpsPort: parseInt(process.env.APP_HTTPS_PORT) || 0,
            appSecret: process.env.APP_SECRET,
            appDocUser:
                (process.env.APP_DOC_USER &&
                    JSON.parse(process.env.APP_DOC_USER)) ||
                null,
            appCertificate:
                (process.env.APP_CERTIFICATE &&
                    JSON.parse(process.env.APP_CERTIFICATE)) ||
                null,
        };
        conf.appPort = parseInt(conf.appPort) || 5000;
    }
    return conf;
};

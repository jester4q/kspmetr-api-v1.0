import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
type TDBConfig = {
    database: string;
    username: string;
    password: string;
};
let conf: MysqlConnectionOptions;

export default (): MysqlConnectionOptions => {
    if (!conf) {
        const DB_ACCESS: TDBConfig = JSON.parse(process.env.DB_ACCESS);
        conf = {
            ...DB_ACCESS,
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            synchronize: false,
            logger: 'file',
            logging: ['query', 'error'],
        };
    }
    return conf;
};

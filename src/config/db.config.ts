let conf;

type DBConf = {
    database: string;
    type: 'mysql' | 'mariadb';
    host: string;
    port: number;
    username: string;
    password: string;
};

export default (): { default: DBConf } => {
    if (!conf) {
        const DB_ACCESS = JSON.parse(process.env.DB_ACCESS);
        conf = {
            default: DB_ACCESS,
        };
    }
    return conf;
};

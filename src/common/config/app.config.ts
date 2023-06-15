let conf;

export default (): {
    appSecret: string;
    appHttpPort: number;
    appHttpUrl: string;
    appEmailAddresser: string;
    appDocUser: { username: string; password: string };
} => {
    if (!conf) {
        conf = {
            appHttpPort: parseInt(process.env.APP_HTTP_PORT) || 3000,
            appHttpUrl: process.env.APP_HTTP_URL || 'http://localhost:3000/',
            appSecret: process.env.APP_SECRET,
            appEmailAddresser: process.env.APP_EMAIL_ADDRESSER,
            appDocUser: (process.env.APP_DOC_USER && JSON.parse(process.env.APP_DOC_USER)) || null,
        };
        conf.appPort = parseInt(conf.appPort) || 5000;
    }
    return conf;
};

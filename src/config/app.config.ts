let conf;

export default (): { appSecret: string; appPort: number } => {
    if (!conf) {
        conf = {
            appPort: process.env.APP_PORT,
            appSecret: process.env.APP_SECRET,
        };
        conf.appPort = parseInt(conf.appPort) || 5000;
    }
    return conf;
};

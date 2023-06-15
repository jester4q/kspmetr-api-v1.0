let conf;

export default (): {
    requestsPerDay: number;
} => {
    if (!conf) {
        conf = {
            requestsPerDay: parseInt(process.env.LIMIT_REQUESTS_PER_DAY) || -1,
        };
    }
    return conf;
};

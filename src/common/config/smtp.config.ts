import SMTPConnection from 'nodemailer/lib/smtp-connection';
type TDBConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
};
let conf: SMTPConnection.Options;

export default (): SMTPConnection.Options => {
    if (!conf) {
        const SMTP_ACCESS: TDBConfig = JSON.parse(process.env.SMTP_ACCESS);
        conf = {
            host: SMTP_ACCESS.host,
            port: SMTP_ACCESS.port,
            secure: SMTP_ACCESS.port == 465, // true for 465, false for other ports
            auth: {
                user: SMTP_ACCESS.username,
                pass: SMTP_ACCESS.password,
            },
        };
    }
    return conf;
};

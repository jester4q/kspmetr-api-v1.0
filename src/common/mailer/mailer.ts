import * as nodemailer from 'nodemailer';
import * as nodemailerInlineBase64 from 'nodemailer-plugin-inline-base64';
import smtpConfig from '../config/smtp.config';

export class Mailer {
    private transport;

    constructor() {}

    send(from: string, to: string, subject: string, body: string): Promise<boolean> {
        const transport = this.getTransport();
        transport.use('compile', nodemailerInlineBase64());
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: body,
        };

        const sent = new Promise<boolean>(async function (resolve, reject) {
            await transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Message sent: %s', error);
                    return reject(false);
                }
                console.log('Message sent: %s', info.messageId);
                resolve(true);
            });
        });

        return sent;
    }

    private getTransport() {
        if (!this.transport) {
            this.transport = nodemailer.createTransport(smtpConfig());
        }
        return this.transport;
    }
}

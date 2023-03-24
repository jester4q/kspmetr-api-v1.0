import * as fs from 'fs';
import * as fsr from 'mkdirp';

const LINE_LEN = 64;
const LOGS_DIR = 'logs';

export class Logger {
    constructor(private dir: string) {
        const path = `${LOGS_DIR}/${dir}`;

        if (!fs.existsSync(LOGS_DIR)) {
            fs.mkdirSync(LOGS_DIR);
        }

        if (!fs.existsSync(path)) {
            fsr.sync(path);
        }
    }

    log(message: string) {
        const msg = `${this.line()}\n${message}\n${this.line()}\n\n`;

        fs.appendFile(
            `${LOGS_DIR}/${this.dir}/${new Date().toISOString().split('T')[0]}`,
            msg,
            (err) => {
                if (err) {
                    throw err;
                }
            },
        );
    }

    private line(message = '') {
        let line = '-'.repeat(LINE_LEN);

        if (message) {
            message = ` ${message} `;
            const index: number = Math.round(
                (line.length - message.length) / 2,
            );
            line =
                line.substr(0, index) +
                message +
                line.substr(index + message.length);
        }

        return line;
    }
}

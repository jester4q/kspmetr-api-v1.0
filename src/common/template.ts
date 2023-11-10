import * as fs from 'fs';
import * as fsr from 'mkdirp';

export class Template {
    constructor(private path: string, private vars: { [key: string]: string }) {}

    async build() {
        const tmp = await this.readFile();
        let styles = await this.readStyles();
        styles = this.setVars(styles, this.vars);
        const vars = { ...this.vars, EMAIL_STYLE: styles };
        const result = this.setVars(tmp, vars);
        // this.log(result);
        return result;
    }

    private readFile(): Promise<string> {
        const path = __basedir + '/template/' + this.path;
        return this.read(path);
    }

    private readStyles(): Promise<string> {
        const path = __basedir + '/template/email.style.html';
        return this.read(path);
    }

    private read(path: string): Promise<string> {
        const read = new Promise<string>(async function (resolve, reject) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    reject(err);
                } else {
                    resolve(html);
                }
            });
        });
        return read;
    }

    private setVars(tmp: string, vars: { [key: string]: string }) {
        return tmp.replace(
            /%(\w*)%/gi, // or /{(\w*)}/g for "{this} instead of %this%"
            (m, key) => {
                return vars.hasOwnProperty(key) ? vars[key] : '';
            },
        );
    }

    private log(txt: string) {
        const path = `logs/tmp.html`;

        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs');
        }

        //if (!fs.existsSync(path)) {
        //    fsr.sync(path);
        //}

        fs.writeFileSync(path, txt);
    }
}

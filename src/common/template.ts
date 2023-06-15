import * as fs from 'fs';

export class Template {
    constructor(private path: string, private vars: { [key: string]: string }) {}

    async build() {
        const tmp = await this.readFile();
        const result = tmp.replace(
            /%(\w*)%/gi, // or /{(\w*)}/g for "{this} instead of %this%"
            (m, key) => {
                return this.vars.hasOwnProperty(key) ? this.vars[key] : '';
            },
        );
        return result;
    }

    private readFile(): Promise<string> {
        const path = __basedir + '/template/' + this.path;
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
}

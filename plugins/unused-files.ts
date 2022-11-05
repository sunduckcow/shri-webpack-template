import path from 'path';
import { Compiler } from 'webpack';
import * as fs from 'fs';

type Input = {
    input: string,
    output: string,
    whiteList?: Array<string>
}

class UnusedFiles {
    output: Set<string>
    excludes: Set<string>
    outDir: string

    constructor({input, output, whiteList}: Input) {
        this.excludes = new Set(whiteList)
        this.outDir = output
        this.output = new Set(
            this.allFiles(input)
        )
    }  

    allFiles(input: string): Array<string> {
        return fs.readdirSync(input)
        .map(name => path.join(input, name))
        .filter(dir => !this.excludes.has(dir))
        .flatMap(dir => fs.lstatSync(dir).isFile() ? dir : this.allFiles(dir))
    }

    apply(compiler: Compiler) {
        compiler.hooks.afterDone.tap('UnusedFiles', (stats) => {
            stats.compilation.modules.forEach(module => {
                //@ts-ignore
                this.output.delete(module.resource)
            });
            fs.writeFileSync(this.outDir, JSON.stringify(Array.from(this.output)));
        });
    }
}

export default UnusedFiles;

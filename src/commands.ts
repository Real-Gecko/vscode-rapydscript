import * as vscode from "vscode";
import { TextDocument } from "vscode";
const compile = require("./rapydscript/tools/compile");

export function compileCurrentFile(
    minify: boolean = false,
    baselib: boolean = false
): void {
    if (vscode.window.activeTextEditor) {
        const document: TextDocument = vscode.window.activeTextEditor.document;
        if (document.languageId !== "rapydscript") {
            return;
        }
        const outFileName: string = document.uri.fsPath.replace(
            ".pyj",
            minify ? ".min.js" : ".js"
        );
        // args.push("-o", outFileName, document.uri.fsPath);
        const args = {
            js_version: 6,
            files: [document.uri.fsPath],
            mode: "compile",
            output: outFileName,
            omit_baselib: false,
            uglify: false,
        };
        compile(
            undefined,
            args,
            __dirname,
            `${__dirname}/rapydscript/src`,
            `${__dirname}/rapydscript/release`
        );
    }
}

export function compileWithBaselib(): void {
    compileCurrentFile(true, true);
}

export function compileAndMinify(): void {
    compileCurrentFile(true, true);
}

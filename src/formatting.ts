import { spawn } from "child_process";
import * as vscode from "vscode";
import {
    CancellationToken,
    DocumentFormattingEditProvider,
    FormattingOptions,
    TextDocument,
    TextEdit,
} from "vscode";

export class RapydScriptDocumentFormattingEditProvider
    implements DocumentFormattingEditProvider
{
    async provideDocumentFormattingEdits(
        document: TextDocument,
        options: FormattingOptions,
        token: CancellationToken
    ): Promise<TextEdit[]> {
        return new Promise<TextEdit[]>((resolve, reject) => {
            let stdout = "";
            let stderr = "";
            const child = spawn("black", ["-c", document.getText()]);
            // child.stdin.write(document.getText());
            child.stdin.end();
            child.stdout.on("data", (data) => {
                stdout += data;
            });
            child.stderr.on("data", (data) => {
                stderr += data;
            });
            child.on("close", () => {
                if (stderr) {
                    vscode.window.showErrorMessage(stderr);
                    reject();
                } else {
                    resolve([
                        TextEdit.replace(
                            new vscode.Range(
                                0,
                                0,
                                document.lineCount - 1,
                                document.lineAt(
                                    document.lineCount - 1
                                ).text.length
                            ),
                            stdout
                        ),
                    ]);
                }
            });
        });
    }
}

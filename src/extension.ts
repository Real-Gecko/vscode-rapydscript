import * as vscode from "vscode";
import { compileWithBaselib } from "./commands";
import { BuiltinsProvider, DotProvider } from "./completion-provider";
import { updateDiagnostics } from "./diagnostics";
import { RapydScriptDocumentFormattingEditProvider } from "./formatting";
import {
    legend,
    RapydScriptDocumentSemanticTokensProvider,
} from "./token-provider";

let rsStatusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    // Completions
    vscode.languages.registerCompletionItemProvider(
        "rapydscript",
        new BuiltinsProvider()
    );
    vscode.languages.registerCompletionItemProvider(
        "rapydscript",
        new DotProvider(),
        "."
    );

    // Semantic
    vscode.languages.registerDocumentSemanticTokensProvider(
        "rapydscript",
        new RapydScriptDocumentSemanticTokensProvider(),
        legend
    );

    // Diagnostics
    const collection =
        vscode.languages.createDiagnosticCollection("rapydscript");
    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document, collection);
    }
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((editor) => {
            if (editor) {
                updateDiagnostics(editor.document, collection);
            }
        })
    );

    // Compile
    context.subscriptions.push(
        // vscode.commands.registerCommand(
        //     "vscode-rapydscript.compile",
        //     compileCurrentFile
        // ),
        vscode.commands.registerCommand(
            "vscode-rapydscript.compile-with-baselib",
            compileWithBaselib
        )
        // vscode.commands.registerCommand(
        //     "vscode-rapydscript.compile-and-minify",
        //     compileAndMinify
        // )
    );

    // Formatting
    vscode.languages.registerDocumentFormattingEditProvider(
        "rapydscript",
        new RapydScriptDocumentFormattingEditProvider()
    );

    // Status bar
    rsStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100
    );
    rsStatusBarItem.command = "vscode-rapydscript.compile-with-baselib";
    rsStatusBarItem.text = `$(zap) RapydScript compile`;
    context.subscriptions.push(rsStatusBarItem);
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
    );
    updateStatusBarItem();
}

function updateStatusBarItem(): void {
    if (vscode.window.activeTextEditor?.document.languageId !== "rapydscript") {
        rsStatusBarItem.hide();
    } else {
        rsStatusBarItem.show();
    }
}
export function deactivate() {}

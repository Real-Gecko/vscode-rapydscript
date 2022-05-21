import {
    Diagnostic,
    DiagnosticCollection,
    DiagnosticSeverity,
    Position,
    Range,
    TextDocument,
} from "vscode";

const lint = require("./rapydscript/tools/lint");

const severityMap: Map<string, DiagnosticSeverity> = new Map([
    ["undef", DiagnosticSeverity.Error],
    ["syntax-err", DiagnosticSeverity.Error],
    ["unused-local", DiagnosticSeverity.Warning],
    ["unused-import", DiagnosticSeverity.Warning],
]);

export function updateDiagnostics(
    document: TextDocument,
    collection: DiagnosticCollection
): void {
    if (document.languageId !== "rapydscript") {
        return;
    }
    const diagnostics: Diagnostic[] = [];
    const res = lint.lint_code(document.getText());
    res.forEach((msg: any) => {
        const diagnostic: Diagnostic = {
            severity: severityMap.get(msg.ident) || DiagnosticSeverity.Error,
            range: new Range(
                new Position(msg.start_line - 1, msg.start_col),
                new Position(
                    msg.end_line ? msg.start_line - 1 : msg.start_line - 1,
                    msg.end_col ?? msg.start_col
                )
            ),
            code: msg.ident,
            message: msg.message,
            source: "RapydScript",
        };
        diagnostics.push(diagnostic);
    });
    collection.set(document.uri, diagnostics);
}

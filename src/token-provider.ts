import {
    CancellationToken,
    DocumentSemanticTokensProvider,
    Range,
    SemanticTokens,
    SemanticTokensBuilder,
    SemanticTokensLegend,
    TextDocument,
} from "vscode";

const compiler = require("./rapydscript/tools/compiler").create_compiler();
const lint = require("./rapydscript/tools/lint");

export const legend = new SemanticTokensLegend(
    ["namespace", "function", "type", "variable", "class"],
    ["defaultLibrary", "declaration"]
);

function tokenize(
    nodeList: any[],
    builder: SemanticTokensBuilder,
    document: TextDocument
): void {
    for (const node of nodeList) {
        if (node.constructor.name === "AST_Import") {
            builder.push(
                new Range(
                    document.positionAt(node.end.pos),
                    document.positionAt(node.end.endpos)
                ),
                "namespace",
                ["defaultLibrary"]
            );
        }
        if (node.constructor.name === "AST_Call") {
            builder.push(
                new Range(
                    document.positionAt(node.expression.end.pos),
                    document.positionAt(node.expression.end.endpos)
                ),
                "function",
                []
            );
        }
        if (node.constructor.name === "AST_SymbolRef") {
            builder.push(
                new Range(
                    document.positionAt(node.end.pos),
                    document.positionAt(node.end.endpos)
                ),
                "variable",
                []
            );
        }
        if (node.constructor.name === "AST_ClassCall") {
            builder.push(
                new Range(
                    document.positionAt(node.start.pos),
                    document.positionAt(node.start.endpos)
                ),
                "class",
                []
            );
        }
    }
}

export class RapydScriptDocumentSemanticTokensProvider
    implements DocumentSemanticTokensProvider
{
    async provideDocumentSemanticTokens(
        document: TextDocument,
        token: CancellationToken
    ): Promise<SemanticTokens> {
        const builder = new SemanticTokensBuilder(legend);
        try {
            const ast = await compiler.parse(document.getText(), {
                for_linting: true,
            });
            const linter = new lint.Linter(ast, undefined, document.getText(), {
                builtins: {},
            });
            ast.walk(linter);
            tokenize(linter.node_list, builder, document);
        } catch (error) {
            console.error("RapydScript semantic builder", error);
        }
        return builder.build();
    }
}

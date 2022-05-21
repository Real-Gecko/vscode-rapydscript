import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    CompletionList,
    Position,
    ProviderResult,
    TextDocument,
} from "vscode";
import { getBuiltins, keywords, prepareDotCompletions } from "./completions";

export class BuiltinsProvider implements CompletionItemProvider {
    provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        var result: CompletionItem[] = [];
        for (const comp of keywords) {
            const item = new CompletionItem(comp, CompletionItemKind.Keyword);
            result.push(item);
        }
        for (const comp of getBuiltins()) {
            const item = new CompletionItem(
                comp.slice(0, -1), // remove dot from the end
                CompletionItemKind.Class
            );
            result.push(item);
        }
        return result;
    }
}

export class DotProvider implements CompletionItemProvider {
    completions: Map<string, CompletionItem[]>;
    constructor() {
        this.completions = prepareDotCompletions();
    }
    provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): ProviderResult<CompletionItem[] | CompletionList<CompletionItem>> {
        if (context.triggerKind === 0) {
            return;
        }
        const line = document
            .lineAt(position)
            .text.substring(0, position.character);
        const lastWord = line.split(" ").slice(-1)[0];
        if (this.completions.has(lastWord) && line.endsWith(lastWord)) {
            return this.completions.get(lastWord);
        } else {
            return [];
        }
    }
}

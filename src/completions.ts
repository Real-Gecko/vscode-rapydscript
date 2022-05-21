import { CompletionItem, CompletionItemKind, SnippetString } from "vscode";
import { DocItem, index } from "./docs/index";
import keywordsDocs from "./docs/keywords.json";

export const keywords = keywordsDocs;

export function getBuiltins(): string[] {
    const result: string[] = [];
    index.forEach((items, key) => {
        result.push(key);
    });
    return result;
}

function process(entry: DocItem): CompletionItem {
    const completionItem = new CompletionItem(entry.property);
    if (entry.property.endsWith("()")) {
        completionItem.kind = CompletionItemKind.Method;
        completionItem.insertText = new SnippetString(
            entry.property.replace("()", "($1)")
        );
    } else {
        completionItem.kind = CompletionItemKind.Property;
    }
    completionItem.documentation = entry.description;
    return completionItem;
}

export function prepareDotCompletions(): Map<string, CompletionItem[]> {
    const result: Map<string, CompletionItem[]> = new Map();
    index.forEach((items: DocItem[], key: string) => {
        result.set(key, new Array());
        items.forEach((item: DocItem) => {
            result.get(key)?.push(process(item));
        });
    });
    return result;
}

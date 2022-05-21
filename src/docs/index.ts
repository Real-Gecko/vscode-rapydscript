import ArrayDocs from "./Array.json";
import consoleDocs from "./console.json";
import DateDocs from "./Date.json";
import documentDocs from "./document.json";
import JSONDocs from "./JSON.json";
import StringDocs from "./String.json";
import windowDocs from "./window.json";

export interface DocItem {
    property: string;
    description: string;
}

export const index: Map<string, DocItem[]> = new Map([
    ["Array.", ArrayDocs],
    ["console.", consoleDocs],
    ["Date.", DateDocs],
    ["document.", documentDocs],
    ["String.", StringDocs],
    ["window.", windowDocs],
    ["JSON.", JSONDocs],
]);

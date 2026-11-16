import { IDomNode } from "./interfaces.js";
import { Internal } from "../internal.js";

export function tagError(node: IDomNode, path: IDomNode[], root: IDomNode, internal: Internal, cause = "") {
    const text: string[] = ["Invalid HTML will be generated", `That tag ${node.name} declared at ${node.location}`];
    let it = 0;

    while (it < path.length && path[it] !== root) {
        text.push(`used in ${path[it].name}, declared at ${path[it].location}`);
        it++;
    }

    text.push(`can not be used in ${root.name}, declared at ${root.location}`);

    if (cause) {
        text.push(cause);
    }

    internal.reportError("Invalid HTML", undefined, new Error(text.join("\n")));
}

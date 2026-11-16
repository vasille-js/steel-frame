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

function mergeBranches(actual: IDomNode[][], next: IDomNode[][]): IDomNode[][] {
    if (next.length === 1) {
        return actual.map(nodes => [...nodes, ...next[0]]);
    } else {
        return actual.map(nodes => next.map(nextNodes => [...nodes, ...nextNodes])).flat(1);
    }
}

export function mergeFragments(nodes: IDomNode[]): IDomNode[][] {
    let ret: IDomNode[][] = [[]];

    for (const node of nodes) {
        if (node.name) {
            const variations = mergeFragments(node.children);
            const clone: IDomNode = {
                ...node,
                children: variations.length === 1 ? variations[0] : [],
                variations: variations.length > 1 ? variations.map(children => ({ children })) : undefined,
            };

            ret = ret.map(nodes => [...nodes, clone]);
        } else if (node.variations) {
            const next = node.variations.map(variation => mergeFragments(variation.children));

            for (const variant of next) {
                ret = mergeBranches(ret, variant);
            }
        } else {
            ret = mergeBranches(ret, mergeFragments(node.children));
        }
    }

    return ret;
}

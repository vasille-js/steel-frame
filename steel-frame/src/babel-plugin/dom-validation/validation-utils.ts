import { IDomNode, SlotsData } from "./interfaces.js";
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

export function mergeFragments(nodes: IDomNode[], slots: SlotsData): IDomNode[][] {
    let ret: IDomNode[][] = [[]];

    for (const node of nodes) {
        const slotContent = node.slotName && slots[node.slotName];
        const child: IDomNode = slotContent
            ? {
                  ...node,
                  children: slotContent.length === 1 ? slotContent[0] : [],
                  variations:
                      slotContent.length > 1 ? slotContent.map(variation => ({ children: variation })) : undefined,
              }
            : node;

        if (child.name) {
            const variations = mergeFragments(child.children, slots);
            const clone: IDomNode = {
                ...child,
                children: variations.length === 1 ? variations[0] : [],
                variations: variations.length > 1 ? variations.map(children => ({ children })) : undefined,
            };

            ret = ret.map(nodes => [...nodes, clone]);
        } else if (child.variations) {
            const next = child.variations.map(variation => mergeFragments(variation.children, slots));

            for (const variant of next) {
                ret = mergeBranches(ret, variant);
            }
        } else {
            ret = mergeBranches(
                ret,
                mergeFragments(child.children, child.slotsPreFill ? { ...slots, ...child.slotsPreFill } : slots),
            );
        }
    }

    return ret;
}

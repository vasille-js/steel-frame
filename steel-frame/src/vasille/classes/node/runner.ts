import { Tag, TextNode } from "./node.js";

/**
 * A runner executes DOM manipulations
 */
export interface IRunner<Node, Element extends Node, TagOptions extends object> {
    insertBefore(node: Node, before: Node | Element): void;
    appendChild(node: Element, child: Node | Element): void;

    textNode(deep: number, text: unknown, node: Node): TextNode<Node, Element, TagOptions>;
    tag(
        deep: number,
        node: Node,
        tagName: string,
        input: TagOptions,
        cb?: (ctx: Tag<Node, Element, TagOptions>) => void,
    ): Tag<Node, Element, TagOptions>;
}

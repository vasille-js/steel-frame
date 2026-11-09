import { Root, Tag, TextNode } from "./node.js";

/**
 * A runner executes DOM manipulations
 */
export interface IRunner<Node, Element extends Node, TagOptions extends object> {
    insertBefore(node: Node, before: Node | Element): void;
    appendChild(node: Element, child: Node | Element): void;

    textNode(
        parent: Root<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        text: unknown,
    ): TextNode<Node, Element, TagOptions>;
    tag(
        parent: Root<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        tagName: string,
        input: TagOptions,
        cb?: (ctx: Tag<Node, Element, TagOptions>) => void,
    ): Tag<Node, Element, TagOptions>;
}

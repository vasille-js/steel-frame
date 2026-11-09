import { Fragment, Root, RootInit } from "./node.js";
import { IRunner } from "./runner.js";

/**
 * Represents a Vasille.js application
 * @class AppNode
 * @extends Root
 */
export class AppNode<
    Node,
    Element extends Node,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions> = IRunner<Node, Element, TagOptions>,
> extends Root<Node, Element, TagOptions, Runner> {
    public readonly node!: Element;

    /**
     * Constructs an app node
     */
    constructor(node: Element, runner: Runner) {
        super({ runner, node, pos: 0 });
    }

    public appendNode(node: Node) {
        this.runner.appendChild(this.node, node);
    }
}

export class PortalNode<
    Node,
    Element extends Node,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions> = IRunner<Node, Element, TagOptions>,
> extends Fragment<Node, Element, TagOptions, Runner> {
    public readonly node!: Element;

    constructor(parent: Root<Node, Element, TagOptions, Runner>, node: Element) {
        super(parent);
        this.node = node;
    }

    public override compose() {
        this.refreshDeep(0);
    }

    public override appendNode(node: Node) {
        this.runner.appendChild(this.node, node);
    }

    public override destroy(deep: number) {
        super.destroy(deep);
    }
}

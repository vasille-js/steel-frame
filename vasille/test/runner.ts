import { internalError } from "../src/classes/core/errors.js";
import { IValue, Tag, TextNode } from "../src/classes/index.js";
import { IRunner } from "../src/classes/node/runner.js";

export interface TagOptions {
    c?: string[];
    callback?: (node: Element) => unknown;
    slot?: (ctx: MockTag<typeof this, Runner<typeof this>>) => void;
}

export class MockTextNode<Options extends TagOptions, RunnerT extends Runner<Options>> extends TextNode<
    Node,
    Element,
    Options,
    RunnerT
> {
    protected node!: Text;

    public compose(): void {
        const text = this.data;

        this.node = this.runner.document.createTextNode((text instanceof IValue ? text.V : text)?.toString() ?? "");

        if (text instanceof IValue) {
            this.handler = (v: unknown) => {
                this.node.replaceData(0, -1, v?.toString() ?? "");
            };
            text.on(this.handler);
        }
        this.parent.appendNode(this.node);
    }

    public override destroy(deep: number, keepNodes?: boolean) {
        if (!keepNodes) {
            this.node.remove();
        }
        super.destroy(deep, keepNodes);
    }

    public override unmount(): void {
        this.node.remove();
    }

    public override remount(): void {
        if (this.next) {
            this.next.insertAdjacent(this.node);
        } else {
            this.parent.appendNode(this.node);
        }
    }

    protected findFirstChild(): Node {
        return this.node;
    }
}

export class MockTag<Options extends TagOptions, RunnerT extends Runner<Options>> extends Tag<
    Node,
    Element,
    Options,
    RunnerT
> {
    public compose(): void {
        const name = this.name;

        if (!name) {
            throw internalError("wrong Tag constructor call");
        }

        const node = this.runner.document.createElement(name);
        const options = this.options;

        this.node = node;
        this.parent.appendNode(node);
        options.slot?.(this);

        if (options.c) {
            for (const className of options.c) {
                node.classList.add(className);
            }
        }

        if (options.callback) {
            options.callback(node);
        }
    }

    public override destroy(deep: number, keepNodes?: boolean) {
        super.destroy(deep, true);
        /* istanbul ignore else */
        if (!keepNodes) {
            this.node?.remove();
        }
    }

    public override unmount(): void {
        this.node?.remove();
    }

    public override remount(): void {
        const { node } = this;

        /* istanbul ignore else */
        if (node) {
            if (this.next) {
                this.next.insertAdjacent(node);
            } else {
                this.parent.appendNode(node);
            }
        }
    }
}

export class Runner<Options extends TagOptions> implements IRunner<Node, Element, Options> {
    public readonly document: Document;

    public constructor(document: Document) {
        this.document = document;
    }

    insertBefore(node: Node, before: Element | Node): void {
        const parent = before.parentElement;

        /* istanbul ignore else */
        if (parent) {
            parent.insertBefore(node, before);
        }
    }
    appendChild(node: Element, child: Element | Node): void {
        node.appendChild(child);
    }
    textNode(deep: number, text: unknown): TextNode<Node, Element, Options> {
        return new MockTextNode({ text }, this, deep);
    }
    tag(
        deep: number,
        tagName: string,
        input: Options,
        cb?: ((ctx: Tag<Node, Element, Options>) => void) | undefined,
    ): Tag<Node, Element, Options> {
        if (cb) {
            input.slot = cb;
        }

        return new MockTag(input, this, tagName, deep);
    }
}

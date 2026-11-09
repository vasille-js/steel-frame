import { Fragment } from "../../classes/index.js";
import { IRunner } from "../../classes/node/runner.js";
import { processComponentProps } from "./components.js";
import { InspectableReactive, inspector, provideId, StaticPosition } from "./inspectable.js";
import { Root } from "../../classes/node/node.js";

export const ModelId = Symbol("model-id");

export class DevFragment<Node, Element extends Node, TagOptions extends object>
    extends Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>
    implements InspectableReactive
{
    override id: number;
    declaration: StaticPosition | null;

    public constructor(
        parent: Root<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        declaration: StaticPosition | null,
        usage: StaticPosition | null,
        name: string,
        props: object,
    ) {
        super(parent);
        this.id = provideId();
        this.declaration = declaration;

        inspector.createComponent({
            id: this.id,
            declaration: declaration,
            usage: usage,
            name: name,
            time: Date.now(),
        });
        inspector.setElementParent({ parent: parent.id!, child: this.id });
        this.refreshDeep(0);

        processComponentProps(this.id, props);
    }

    public override link(
        prev: Fragment<Node, Element, TagOptions> | undefined,
        next: Fragment<Node, Element, TagOptions> | undefined,
    ) {
        super.link(prev, next);
    }

    public override d(deep: number, keepNodes?: boolean): void {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.d(deep, keepNodes);
    }

    protected override push(node: Fragment<Node, Element, TagOptions>): void {
        if ("id" in node && typeof node.id == "number") {
            inspector.setElementParent({
                parent: this.id,
                child: node.id,
            });
        }
        super.push(node);
    }
}

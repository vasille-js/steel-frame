import {
    ArrayModelViewNode,
    Fragment,
    IValue,
    MapViewNode,
    Reference,
    SetViewNode,
    ArrayViewNode,
} from "../../classes/index.js";
import { IRunner } from "../../classes/node/runner.js";
import { processComponentProps } from "./components.js";
import { ExecutionPosition, inspector, provideId, StaticPosition, processDevObject } from "./inspectable.js";
import { DevArrayModel, DevMapModel, DevSetModelNode } from "./models.js";
import { DevFragment } from "./node.js";
import { DevReference } from "./state.js";

function createDevFragment<Node, Element, TagOptions extends object>(
    runner: IRunner<Node, Element, TagOptions>,
): DevFragment<Node, Element, TagOptions> {
    return new DevFragment(runner, null, null, "Fragment", {});
}

export class DevArrayModelViewNode<Node, Element, TagOptions extends object, T> extends ArrayModelViewNode<
    T,
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>,
    ExecutionPosition
> {
    public override id: number;

    public constructor(
        runner: IRunner<Node, Element, TagOptions>,
        model: DevArrayModel<T>,
        slot: (ctx: Fragment<Node, Element, TagOptions>, value: T, index: IValue<number, ExecutionPosition>) => void,
        usage: StaticPosition,
        indexDeclaration?: StaticPosition,
    ) {
        super(
            runner,
            1,
            model,
            slot,
            v => (indexDeclaration ? new DevReference(v, this, indexDeclaration) : new Reference(v)),
            runner => createDevFragment(runner),
        );
        this.id = provideId();

        inspector.createComponent({
            id: this.id,
            name: "ArrayModelView",
            usage: usage,
            time: Date.now(),
        });
        processComponentProps(this.id, { model });
    }

    override destroy(deep: number, keepNodes?: boolean) {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }
}

export class DevArrayViewNode<Node, Element, TagOptions extends object, T> extends ArrayViewNode<
    T,
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>,
    ExecutionPosition
> {
    public override id: number;

    public constructor(
        runner: IRunner<Node, Element, TagOptions>,
        model: IValue<T[], ExecutionPosition>,
        key: (item: T) => number | string,
        slot: (
            ctx: Fragment<Node, Element, TagOptions>,
            value: IValue<T, ExecutionPosition>,
            index: IValue<number, ExecutionPosition>,
        ) => void,
        usage: StaticPosition,
        valueDeclaration: StaticPosition | undefined,
        indexDeclaration: StaticPosition | undefined,
    ) {
        super(
            runner,
            1,
            model,
            key,
            slot,
            v => (valueDeclaration ? new DevReference(v, this, valueDeclaration) : new Reference(v)),
            v => (indexDeclaration ? new DevReference(v, this, indexDeclaration) : new Reference(v)),
            runner => createDevFragment(runner),
        );

        this.id = provideId();

        inspector.createComponent({
            id: this.id,
            name: "ArrayView",
            usage: usage,
            time: Date.now(),
        });
        processComponentProps(this.id, { model, key, slot });
    }

    override destroy(deep: number, keepNodes?: boolean) {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }
}

export class DevSetViewNode<Node, Element, TagOptions extends object, T> extends SetViewNode<
    T,
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>
> {
    public override id: number;

    public constructor(
        runner: IRunner<Node, Element, TagOptions>,
        model: DevSetModelNode<T>,
        slot: (ctx: Fragment<Node, Element, TagOptions>, value: T) => void,
        usage: StaticPosition,
    ) {
        super(runner, 1, model, slot, runner => createDevFragment(runner));
        this.id = provideId();

        inspector.createComponent({
            id: this.id,
            name: "SetView",
            usage: usage,
            time: Date.now(),
        });
        processComponentProps(this.id, { model, slot });
    }

    override destroy(deep: number, keepNodes?: boolean) {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }
}

export class DevMapViewNode<Node, Element, TagOptions extends object, K, T> extends MapViewNode<
    K,
    T,
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>
> {
    public override id: number;

    public constructor(
        runner: IRunner<Node, Element, TagOptions>,
        model: DevMapModel<K, T>,
        slot: (ctx: Fragment<Node, Element, TagOptions>, value: IValue<T, ExecutionPosition>, key: K) => void,
        usage: StaticPosition,
        valueDeclaration: StaticPosition | undefined,
    ) {
        super(
            runner,
            1,
            model,
            slot,
            v => (valueDeclaration ? new DevReference(v, this, valueDeclaration) : new Reference(v)),
            runner => createDevFragment(runner),
        );
        this.id = provideId();

        inspector.createComponent({
            id: this.id,
            name: "MapView",
            usage: usage,
            time: Date.now(),
        });
        processComponentProps(this.id, { model, slot });
    }

    override destroy(deep: number, keepNodes?: boolean) {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }
}

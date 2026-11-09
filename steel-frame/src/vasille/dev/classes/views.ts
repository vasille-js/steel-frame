import { ReadableIValue, WritableIValue } from "../../classes/core/ivalue.js";
import { ArrayModelViewNode, Fragment, IValue, MapViewNode, SetViewNode, ArrayViewNode } from "../../classes/index.js";
import { IRunner } from "../../classes/node/runner.js";
import { ref } from "../../functions/index.js";
import { devRef } from "../functions/index.js";
import { processComponentProps } from "./components.js";
import { ExecutionPosition, inspector, provideId, StaticPosition } from "./inspectable.js";
import { DevArrayModel, DevMapModel, DevSetModelNode } from "./models.js";
import { DevFragment } from "./node.js";
import { Root } from "../../classes/node/node.js";
import { ArrayModelProps } from "../../classes/models/array-model.js";
import { SetModelProps } from "../../classes/models/set-model.js";
import { MapModelProps } from "../../classes/models/map-model.js";

function createDevFragment<Node, Element extends Node, TagOptions extends object>(
    parent: Root<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
): DevFragment<Node, Element, TagOptions> {
    return new DevFragment(parent, null, null, "Fragment", {});
}

export class DevArrayModelViewNode<Node, Element extends Node, TagOptions extends object, T> extends ArrayModelViewNode<
    T,
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>,
    ExecutionPosition
> {
    public override id: number;

    public constructor(
        parent: Root<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        props: ArrayModelProps<
            T,
            T | WritableIValue<T, ExecutionPosition>,
            boolean,
            Node,
            Element,
            TagOptions,
            IRunner<Node, Element, TagOptions>,
            ExecutionPosition
        >,
        usage: StaticPosition,
        indexDeclaration?: StaticPosition,
    ) {
        super(parent, props, v => (indexDeclaration ? devRef(v, this, indexDeclaration) : ref(v)), createDevFragment);
        this.id = provideId();

        inspector.createComponent({
            id: this.id,
            name: "ArrayModelView",
            usage: usage,
            time: Date.now(),
        });
        processComponentProps(this.id, props);
    }

    override d(deep: number, keepNodes?: boolean) {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.d(deep, keepNodes);
    }
}

export class DevArrayViewNode<Node, Element extends Node, TagOptions extends object, T> extends ArrayViewNode<
    T,
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>,
    ExecutionPosition
> {
    public override id: number;

    public constructor(
        parent: Root<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        model: IValue<T[], ExecutionPosition>,
        key: (item: T) => number | string,
        slot: (
            ctx: Fragment<Node, Element, TagOptions>,
            value: ReadableIValue<T, ExecutionPosition>,
            index: ReadableIValue<number, ExecutionPosition>,
        ) => void,
        writable: boolean,
        usage: StaticPosition,
        valueDeclaration: StaticPosition | undefined,
        indexDeclaration: StaticPosition | undefined,
    ) {
        super(
            parent,
            model,
            key,
            slot,
            writable,
            v => (valueDeclaration ? devRef(v, this, valueDeclaration) : ref(v)),
            v => (indexDeclaration ? devRef(v, this, indexDeclaration) : ref(v)),
            createDevFragment,
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

    override d(deep: number, keepNodes?: boolean) {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.d(deep, keepNodes);
    }
}

export class DevSetViewNode<Node, Element extends Node, TagOptions extends object, T> extends SetViewNode<
    T,
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>,
    ExecutionPosition
> {
    public override id: number;

    public constructor(
        parent: Root<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        props: SetModelProps<T, Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, ExecutionPosition>,
        usage: StaticPosition,
    ) {
        super(parent, props, createDevFragment);
        this.id = provideId();

        inspector.createComponent({
            id: this.id,
            name: "SetView",
            usage: usage,
            time: Date.now(),
        });
        processComponentProps(this.id, props);
    }

    override d(deep: number, keepNodes?: boolean) {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.d(deep, keepNodes);
    }
}

export class DevMapViewNode<Node, Element extends Node, TagOptions extends object, K, T> extends MapViewNode<
    K,
    T,
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>,
    ExecutionPosition
> {
    public override id: number;

    public constructor(
        parent: Root<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        props: MapModelProps<K, T, Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, ExecutionPosition>,
        usage: StaticPosition,
        valueDeclaration: StaticPosition | undefined,
    ) {
        super(parent, props, v => (valueDeclaration ? devRef(v, this, valueDeclaration) : ref(v)), createDevFragment);
        this.id = provideId();

        inspector.createComponent({
            id: this.id,
            name: "MapView",
            usage: usage,
            time: Date.now(),
        });
        processComponentProps(this.id, props);
    }

    override d(deep: number, keepNodes?: boolean) {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.d(deep, keepNodes);
    }
}

import { IValue } from "../core/ivalue.js";
import { App, Portal } from "../node/app.js";
import { Fragment, SwitchedNode, SwitchedNodeCase } from "../node/node.js";
import { IRunner } from "../node/runner.js";
import { Watch, WatchOptions } from "../node/watch.js";
import { Zombie } from "../node/zombie.js";
import {
    DevValue,
    inspector,
    provideId,
    StaticPosition,
    toDevId,
    toDevIdOrValue,
    processDevObject,
    toDevValue,
} from "./inspectable.js";
import { DevFragment } from "./node.js";

export function processComponentProps(id: number, props: object): void {
    processDevObject(props, (field, value) => {
        inspector.componentProperty({
            id: id,
            name: field,
            value: toDevIdOrValue(value),
        });
    });
}

export class DevWatch<Node, Element, TagOptions extends object, T> extends Watch<Node, Element, TagOptions, T> {
    public override id: number;

    public constructor(
        input: WatchOptions<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, T>,
        runner: IRunner<Node, Element, TagOptions>,
        usage: StaticPosition,
    ) {
        super(input, runner, 1);
        this.rDeep = 0;

        const id = (this.id = provideId());

        inspector.createComponent({
            id: id,
            usage: usage,
            name: "Watch",
            time: Date.now(),
        });
        processComponentProps(id, input);
    }

    public override destroy(deep: number, keepNodes?: boolean): void {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }
}

export class DevApp<Node, Element, TagOptions extends object> extends App<Node, Element, TagOptions> {
    public override id: number;

    public constructor(node: Element, runner: IRunner<Node, Element, TagOptions>) {
        super(node, runner);

        const id = (this.id = provideId());

        inspector.createComponent({
            id: id,
            name: "App",
            time: Date.now(),
        });
    }

    public override destroy(deep: number, keepNodes?: boolean): void {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }
}

export class DevPortal<
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
> extends Portal<Node, Element, TagOptions, Runner> {
    public override id: number;

    constructor(
        node: Element,
        runner: Runner,
        declaration: StaticPosition | undefined,
        usage: StaticPosition | undefined,
        name: string | undefined,
    ) {
        super(node, runner, 1);
        this.rDeep = 0;

        const id = (this.id = provideId());

        inspector.createComponent({
            id: id,
            name: name ?? "Portal",
            declaration: declaration,
            usage: usage,
            time: Date.now(),
        });
    }

    public override destroy(deep: number) {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep);
    }
}

export class DevSwitchedNode<Node, Element, TagOptions extends object> extends SwitchedNode<
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>
> {
    public override id: number;

    public constructor(
        usage: StaticPosition,
        runner: IRunner<Node, Element, TagOptions>,
        cases: SwitchedNodeCase<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>[],
        _default?: (node: Fragment<Node, Element, TagOptions>) => void,
    ) {
        super(runner, 1, cases, _default);
        this.rDeep = 0;

        const id = (this.id = provideId());
        const conditions: { [k: number]: number | DevValue } = {};

        cases.forEach((_case, index) => {
            conditions[index] = _case.slot === _default ? toDevValue(true) : toDevIdOrValue(_case.$case);
        });

        inspector.createComponent({
            id: id,
            name: "Switch",
            usage: usage,
            time: Date.now(),
        });
        processComponentProps(id, conditions);
    }

    public override destroy(deep: number, keepNodes?: boolean): void {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }

    protected override newChild(
        index: number,
    ): Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>> {
        return new DevFragment(this.runner, null, null, "Case", { index });
    }
}

export class DevZombie<Node, Element, TagOptions extends object> extends Zombie<
    Node,
    Element,
    TagOptions,
    IRunner<Node, Element, TagOptions>
> {
    public override id: number;

    public constructor(
        usage: StaticPosition,
        runner: IRunner<Node, Element, TagOptions>,
        time: IValue<number, unknown>,
        trigger: () => void,
    ) {
        super(runner, time, trigger);

        const id = (this.id = provideId());

        inspector.createComponent({
            id: id,
            name: "Switch",
            usage: usage,
            time: Date.now(),
        });
        processComponentProps(id, { time, trigger });
    }

    public override destroy(deep: number, keepNodes?: boolean): void {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }
}

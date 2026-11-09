import { ReadableIValue, WritableIValue } from "../../classes/core/ivalue.js";
import { Fragment, IValue, IRunner as Runner, safe, userError, IRunner } from "../../classes/index.js";
import {
    Delay,
    DelayOptions,
    ForOptions,
    Slot,
    SlotOptions,
    SwitchOptions,
    WatchOptions,
    WritableViewOptions,
    ZombieOptions,
} from "../../functions/components.js";
import {
    DevArrayModel,
    DevArrayModelViewNode,
    DevFragment,
    DevMapModel,
    DevMapViewNode,
    DevSetModelNode,
    DevSetViewNode,
    DevArrayViewNode,
    DevSwitchedNode,
    DevWatchNode,
    DevZombieNode,
    errorToString,
    ExecutionPosition,
    inspector,
    StaticPosition,
} from "../classes/index.js";

export function DevSlot<Node, Element extends Node, TagOptions extends object, T extends object = {}>(
    options: SlotOptions<Node, Element, TagOptions, T> & T,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    defaultSlot: ((ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>) => void) | undefined,
    usage: StaticPosition,
) {
    Slot<Node, Element, TagOptions, T>(options, ctx, defaultSlot, e => {
        inspector.reportComponentSlotError({
            id: "id" in ctx && typeof ctx.id === "number" ? ctx.id : 0,
            error: errorToString(e),
            usage: usage,
            time: Date.now(),
        });
    });
}

export function DevSwitch<Node, Element extends Node, TagOptions extends object>(
    options: SwitchOptions<Node, Element, TagOptions>,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    _slot: undefined,
    usage: StaticPosition,
) {
    ctx.child(new DevSwitchedNode(usage, ctx.runner, ctx.node, options.cases, options.default));
}

export function DevFor<
    Node,
    Element extends Node,
    TagOptions extends object,
    T extends Set<unknown> | Map<unknown, unknown> | unknown[],
    K = T extends unknown[] ? number : T extends Set<infer R> ? R : T extends Map<infer R, unknown> ? R : never,
    V = T extends (infer R)[] ? R : T extends Set<infer R> ? R : T extends Map<unknown, infer R> ? R : never,
>(
    { of: model, slot: _slot }: ForOptions<Node, Element, TagOptions, T, [V, K]>,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    defaultSlot: ((ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>) => void) | undefined,
    usage: StaticPosition,
) {
    const slot = _slot ?? defaultSlot;

    console.warn(
        "<For of/> IS DEPRECATED. Please use ArrayView/ArrayModelView/SetModelView/MapModelView/Iterate/ForEach.",
    );

    if (!slot) {
        return;
    }

    if (model instanceof DevArrayModel) {
        ctx.child(
            new DevArrayModelViewNode<Node, Element, TagOptions, V>(
                ctx.runner,
                ctx.node,
                model,
                (ctx, value, index) => {
                    slot(
                        ctx as Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
                        value as V,
                        index.V as K,
                    );
                },
                false,
                usage,
            ),
        );
    } else if (model instanceof DevMapModel) {
        ctx.child(
            new DevMapViewNode(
                ctx.runner,
                ctx.node,
                model,
                (ctx, value, key) => {
                    slot(ctx as Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>, value.V, key);
                },
                false,
                usage,
                undefined,
            ),
        );
    } else if (model instanceof DevSetModelNode) {
        ctx.child(
            new DevSetViewNode(
                ctx.runner,
                ctx.node,
                model,
                (ctx, value) => {
                    slot(
                        ctx as Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
                        value,
                        value as unknown as K,
                    );
                },
                usage,
            ),
        );
    }
    // fallback if is used external Array/Map/Set
    else {
        const safeSlot = safe(slot);

        console.warn("<For of/> fallback detected. Please use Iterate or ForEach.");

        if (model instanceof Array) {
            (model as Array<V>).forEach((value: V) => {
                safeSlot(ctx, value, value as unknown as K);
            });
        } else if (model instanceof Map) {
            (model as Map<K, V>).forEach((value: V, key: K) => {
                safeSlot(ctx, value, key);
            });
        } else if (model instanceof Set) {
            (model as Set<V>).forEach((value: V) => {
                safeSlot(ctx, value, value as unknown as K);
            });
        } else {
            throw userError("wrong use of `<For of/>` component", "wrong-model");
        }
    }
}

export function DevArrayView<
    Node,
    Element extends Node,
    TagOptions extends object,
    T extends unknown[],
    V = T extends (infer R)[] ? R : never,
>(
    props: Required<
        ForOptions<
            Node,
            Element,
            TagOptions,
            IValue<V[], ExecutionPosition>,
            [ReadableIValue<V, ExecutionPosition>, ReadableIValue<number, ExecutionPosition>]
        >
    > & {
        key: (value: V) => number | string;
        writable: boolean;
    },
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    usage: StaticPosition,
    _defaultSlot: never,
    value: StaticPosition | undefined,
    index: StaticPosition | undefined,
) {
    ctx.child(
        new DevArrayViewNode<Node, Element, TagOptions, V>(
            ctx.runner,
            ctx.node,
            props.of,
            props.key,
            props.slot,
            props.writable,
            usage,
            value,
            index,
        ),
    );
}

export function DevArrayModelView<Node, Element extends Node, TagOptions extends object, V>(
    props: WritableViewOptions<
        Node,
        Element,
        TagOptions,
        DevArrayModel<V>,
        [V | WritableIValue<V, any>, ReadableIValue<number, ExecutionPosition>],
        boolean
    >,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    _defaultSlot: never,
    usage: StaticPosition,
    index: StaticPosition | undefined,
) {
    ctx.child(
        new DevArrayModelViewNode<Node, Element, TagOptions, V>(
            ctx.runner,
            ctx.node,
            props.of,
            props.slot,
            props.writable,
            usage,
            index,
        ),
    );
}

export function DevMapModelView<Node, Element extends Node, TagOptions extends object, K, V>(
    props: WritableViewOptions<
        Node,
        Element,
        TagOptions,
        DevMapModel<K, V>,
        [WritableIValue<V, ExecutionPosition>, K],
        boolean
    >,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    _defaultSlot: never,
    usage: StaticPosition,
    value: StaticPosition | undefined,
) {
    ctx.child(
        new DevMapViewNode<Node, Element, TagOptions, K, V>(
            ctx.runner,
            ctx.node,
            props.of,
            props.slot,
            props.writable,
            usage,
            value,
        ),
    );
}

export function DevSetModelView<Node, Element extends Node, TagOptions extends object, V>(
    props: Required<ForOptions<Node, Element, TagOptions, DevSetModelNode<V>, [V]>>,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    usage: StaticPosition,
) {
    ctx.child(new DevSetViewNode<Node, Element, TagOptions, V>(ctx.runner, ctx.node, props.of, props.slot, usage));
}

export function DevWatch<Node, Element extends Node, TagOptions extends object, T>(
    { r_model, slot: _slot }: WatchOptions<Node, Element, TagOptions, T, ExecutionPosition>,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    defaultSlot: (ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>) => void | undefined,
    usage: StaticPosition,
) {
    const slot = _slot ?? defaultSlot;

    /* istanbul ignore else */
    if (slot) {
        ctx.child(new DevWatchNode({ model: r_model, slot: safe(slot) }, ctx.runner, ctx.node, usage));
    }
}

export function DevDelay<Node, Element extends Node, TagOptions extends object>(
    options: DelayOptions<
        Node,
        Element,
        TagOptions,
        Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>
    >,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    defaultSlot: (ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>) => void | undefined,
    usage: StaticPosition,
) {
    return Delay<Node, Element, TagOptions>(
        options,
        ctx,
        defaultSlot,
        ctx => new DevFragment<Node, Element, TagOptions>(ctx.runner, ctx.node, null, usage, "Delay", options),
    );
}

export function DevZombie<Node, Element extends Node, TagOptions extends object>(
    { r_time, trigger }: ZombieOptions<ExecutionPosition>,
    ctx: DevFragment<Node, Element, TagOptions>,
    defaultSlot: ((ctx: DevZombieNode<Node, Element, TagOptions>) => void) | undefined,
    usage: StaticPosition,
) {
    ctx.child(new DevZombieNode<Node, Element, TagOptions>(usage, ctx.runner, ctx.node, r_time, trigger), defaultSlot);
}

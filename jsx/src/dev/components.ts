import { Fragment, IValue, Runner, safe, userError } from "vasille";
import {
    DevArrayModel,
    DevArrayView as DevCoreArrayView,
    DevFragment,
    DevMapModel,
    DevMapView,
    DevSetModel,
    DevSetView,
    DevSinglePassArrayView,
    DevSwitchedNode,
    DevWatch as DevCoreWatch,
    DevZombie as DevCoreZombie,
    errorToString,
    ExecutionPosition,
    inspector,
    StaticPosition,
} from "vasille/dev";
import {
    Delay,
    DelayOptions,
    ForOptions,
    Slot,
    SlotOptions,
    SwitchOptions,
    WatchOptions,
    ZombieOptions,
} from "../components.js";

export function DevSlot<Node, Element, TagOptions extends object, T extends object = {}>(
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

export function DevSwitch<Node, Element, TagOptions extends object>(
    options: SwitchOptions<Node, Element, TagOptions>,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    _slot: undefined,
    usage: StaticPosition,
) {
    ctx.child(new DevSwitchedNode(usage, ctx.runner, options.cases, options.default));
}

export function DevFor<
    Node,
    Element,
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
        "Vasille <For of/> IS DEPRECATED. " +
            "Please use ArrayView/ArrayModelView/SetModelView/MapModelView/Iterate/ForEach.",
    );

    if (!slot) {
        return;
    }

    if (model instanceof DevArrayModel) {
        ctx.child(
            new DevCoreArrayView<Node, Element, TagOptions, V>(
                ctx.runner,
                model,
                (ctx, value, index) => {
                    slot(
                        ctx as Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
                        value,
                        index.V as K,
                    );
                },
                usage,
            ),
        );
    } else if (model instanceof DevMapModel) {
        ctx.child(
            new DevMapView(
                ctx.runner,
                model,
                (ctx, value, key) => {
                    slot(ctx as Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>, value.V, key);
                },
                usage,
                undefined,
            ),
        );
    } else if (model instanceof DevSetModel) {
        ctx.child(
            new DevSetView(
                ctx.runner,
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

        console.warn("Vasille <For of/> fallback detected. Please use Iterate or ForEach.");

        if (model instanceof Array) {
            model.forEach((value: V) => {
                safeSlot(ctx, value, value as unknown as K);
            });
        } else if (model instanceof Map) {
            model.forEach((value: V, key: K) => {
                safeSlot(ctx, value, key);
            });
        } else if (model instanceof Set) {
            model.forEach((value: V) => {
                safeSlot(ctx, value, value as unknown as K);
            });
        } else {
            throw userError("wrong use of `<For of/>` component", "wrong-model");
        }
    }
}

export function DevArrayView<
    Node,
    Element,
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
            [IValue<V, ExecutionPosition>, IValue<number, ExecutionPosition>]
        >
    > & {
        key: (value: V) => number | string;
    },
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    usage: StaticPosition,
    _defaultSlot: never,
    value: StaticPosition | undefined,
    index: StaticPosition | undefined,
) {
    ctx.child(
        new DevSinglePassArrayView<Node, Element, TagOptions, V>(
            ctx.runner,
            props.of,
            props.key,
            props.slot,
            usage,
            value,
            index,
        ),
    );
}

export function DevArrayModelView<Node, Element, TagOptions extends object, V>(
    props: Required<ForOptions<Node, Element, TagOptions, DevArrayModel<V>, [V, IValue<number, ExecutionPosition>]>>,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    _defaultSlot: never,
    usage: StaticPosition,
    index: StaticPosition | undefined,
) {
    ctx.child(new DevCoreArrayView<Node, Element, TagOptions, V>(ctx.runner, props.of, props.slot, usage, index));
}

export function DevMapModelView<Node, Element, TagOptions extends object, K, V>(
    props: Required<ForOptions<Node, Element, TagOptions, DevMapModel<K, V>, [IValue<V, ExecutionPosition>, K]>>,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    _defaultSlot: never,
    usage: StaticPosition,
    value: StaticPosition | undefined,
) {
    ctx.child(new DevMapView<Node, Element, TagOptions, K, V>(ctx.runner, props.of, props.slot, usage, value));
}

export function DevSetModelView<Node, Element, TagOptions extends object, V>(
    props: Required<ForOptions<Node, Element, TagOptions, DevSetModel<V>, [V]>>,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    usage: StaticPosition,
) {
    ctx.child(new DevSetView<Node, Element, TagOptions, V>(ctx.runner, props.of, props.slot, usage));
}

export function DevWatch<Node, Element, TagOptions extends object, T>(
    { $model, slot: _slot }: WatchOptions<Node, Element, TagOptions, T, ExecutionPosition>,
    ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>,
    defaultSlot: (ctx: Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>) => void | undefined,
    usage: StaticPosition,
) {
    const slot = _slot ?? defaultSlot;

    /* istanbul ignore else */
    if (slot) {
        ctx.child(new DevCoreWatch({ model: $model, slot: safe(slot) }, ctx.runner, usage));
    }
}

export function DevDelay<Node, Element, TagOptions extends object>(
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
    return Delay<Node, Element, TagOptions, Fragment<Node, Element, TagOptions, Runner<Node, Element, TagOptions>>>(
        options,
        ctx,
        defaultSlot,
        ctx => new DevFragment<Node, Element, TagOptions>(ctx.runner, null, usage, "Delay", options),
    );
}

export function DevZombie<Node, Element, TagOptions extends object>(
    { $time, trigger }: ZombieOptions<ExecutionPosition>,
    ctx: DevFragment<Node, Element, TagOptions>,
    defaultSlot: ((ctx: DevCoreZombie<Node, Element, TagOptions>) => void) | undefined,
    usage: StaticPosition,
) {
    ctx.child(new DevCoreZombie<Node, Element, TagOptions>(usage, ctx.runner, $time, trigger), defaultSlot);
}

import {
    ArrayModel,
    ArrayView as CoreArrayView,
    SinglePassArrayView,
    Fragment,
    IValue,
    MapModel,
    MapView as CoreMapView,
    reportError,
    Runner,
    safe,
    SetModel,
    SetView as CoreSetView,
    SwitchedNode,
    userError,
    Watch as CoreWatch,
    Zombie as CoreZombie,
} from "vasille";
import { ref } from "./internal.js";

export interface SlotOptions<Node, Element, TagOptions extends object, T extends object> {
    model?: (input: T, ctx: Fragment<Node, Element, TagOptions>) => void;
    slot?: (input: object, ctx: Fragment<Node, Element, TagOptions>) => void;
}

function frag<Node, Element, TagOptions extends object, TRunner extends Runner<Node, Element, TagOptions>>(
    runner: TRunner,
    deep: number,
) {
    return new Fragment<Node, Element, TagOptions>(runner, deep);
}

export function Slot<Node, Element, TagOptions extends object, T extends object = {}>(
    { model, slot, ...options }: SlotOptions<Node, Element, TagOptions, T> & T,
    ctx: Fragment<Node, Element, TagOptions>,
    defaultSlot?: (ctx: Fragment<Node, Element, TagOptions>) => void,
    handleError = reportError,
) {
    try {
        if (model) {
            model(options as T, ctx);
        } else if (slot) {
            slot({}, ctx);
        } else if (defaultSlot) {
            defaultSlot(ctx);
        }
    } catch (e) {
        handleError(e);
    }
}

export interface SwitchOptions<Node, Element, TagOptions extends object> {
    cases: {
        $case: IValue<unknown, unknown>;
        slot: (ctx: Fragment<Node, Element, TagOptions>) => void;
    }[];
    default?: (ctx: Fragment<Node, Element, TagOptions>) => void;
}

export function Switch<Node, Element, TagOptions extends object>(
    options: SwitchOptions<Node, Element, TagOptions>,
    ctx: Fragment<Node, Element, TagOptions>,
) {
    ctx.child(new SwitchedNode(ctx.runner, ctx.sDeep + 1, options.cases, options.default));
}

export interface ForOptions<Node, Element, TagOptions extends object, T, Args extends unknown[]> {
    of: T;
    slot?: (ctx: Fragment<Node, Element, TagOptions>, ...args: Args) => void;
}

export function For<
    Node,
    Element,
    TagOptions extends object,
    T extends Set<unknown> | Map<unknown, unknown> | unknown[],
    K = T extends unknown[] ? number : T extends Set<infer R> ? R : T extends Map<infer R, unknown> ? R : never,
    V = T extends (infer R)[] ? R : T extends Set<infer R> ? R : T extends Map<unknown, infer R> ? R : never,
>(
    { of: model, slot: _slot }: ForOptions<Node, Element, TagOptions, T, [V, K]>,
    ctx: Fragment<Node, Element, TagOptions>,
    defaultSlot?: (ctx: Fragment<Node, Element, TagOptions>) => void,
) {
    const slot = _slot ?? defaultSlot;

    if (!slot) {
        return;
    }

    if (model instanceof ArrayModel) {
        ctx.child(
            new CoreArrayView<V, Node, Element, TagOptions, Runner<Node, Element, TagOptions>, unknown>(
                ctx.runner,
                ctx.sDeep + 1,
                model,
                (ctx, value, index) => {
                    slot(ctx, value, index.V as K);
                },
                ref,
                frag,
            ),
        );
    } else if (model instanceof MapModel) {
        ctx.child(
            new CoreMapView<K, V, Node, Element, TagOptions, Runner<Node, Element, TagOptions>>(
                ctx.runner,
                ctx.sDeep + 1,
                model,
                (ctx, value, key) => {
                    slot(ctx, value.V, key);
                },
                ref,
                frag,
            ),
        );
    } else if (model instanceof SetModel) {
        ctx.child(
            new CoreSetView<V, Node, Element, TagOptions, Runner<Node, Element, TagOptions>>(
                ctx.runner,
                ctx.sDeep + 1,
                model,
                (ctx, value) => {
                    slot(ctx, value, value as unknown as K);
                },
                frag,
            ),
        );
    }
    // fallback if is used external Array/Map/Set
    else {
        const safeSlot = safe(slot);

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

export function ArrayView<
    Node,
    Element,
    TagOptions extends object,
    T extends unknown[],
    V = T extends (infer R)[] ? R : never,
>(
    props: {
        $of: IValue<V[], unknown>;
        key: (value: V) => number | string;
        slot: (
            ctx: Fragment<Node, Element, TagOptions>,
            value: IValue<V, unknown>,
            index: IValue<number, unknown>,
        ) => void;
    },
    ctx: Fragment<Node, Element, TagOptions>,
) {
    ctx.child(
        new SinglePassArrayView<V, Node, Element, TagOptions, Runner<Node, Element, TagOptions>, unknown>(
            ctx.runner,
            ctx.sDeep + 1,
            props.$of,
            props.key,
            props.slot,
            ref,
            ref,
            frag,
        ),
    );
}

export function ArrayModelView<Node, Element, TagOptions extends object, V>(
    props: Required<ForOptions<Node, Element, TagOptions, ArrayModel<V>, [V, IValue<number, unknown>]>>,
    ctx: Fragment<Node, Element, TagOptions>,
) {
    ctx.child(
        new CoreArrayView<V, Node, Element, TagOptions, Runner<Node, Element, TagOptions>, unknown>(
            ctx.runner,
            ctx.sDeep + 1,
            props.of,
            props.slot,
            ref,
            frag,
        ),
    );
}

export function MapModelView<Node, Element, TagOptions extends object, K, V>(
    props: Required<ForOptions<Node, Element, TagOptions, MapModel<K, V>, [IValue<V, unknown>, K]>>,
    ctx: Fragment<Node, Element, TagOptions>,
) {
    ctx.child(
        new CoreMapView<K, V, Node, Element, TagOptions, Runner<Node, Element, TagOptions>>(
            ctx.runner,
            ctx.sDeep + 1,
            props.of,
            props.slot,
            ref,
            frag,
        ),
    );
}

export function SetModelView<Node, Element, TagOptions extends object, V>(
    props: Required<ForOptions<Node, Element, TagOptions, SetModel<V>, [V]>>,
    ctx: Fragment<Node, Element, TagOptions>,
) {
    ctx.child(
        new CoreSetView<V, Node, Element, TagOptions, Runner<Node, Element, TagOptions>>(
            ctx.runner,
            ctx.sDeep + 1,
            props.of,
            props.slot,
            frag,
        ),
    );
}

export interface WatchOptions<Node, Element, TagOptions extends object, T, Extra = unknown> {
    $model: IValue<T, Extra>;
    slot?: (ctx: Fragment<Node, Element, TagOptions>, value: T) => void;
}

export function Watch<Node, Element, TagOptions extends object, T>(
    { $model, slot: _slot }: WatchOptions<Node, Element, TagOptions, T>,
    ctx: Fragment<Node, Element, TagOptions>,
    defaultSlot?: (ctx: Fragment<Node, Element, TagOptions>) => void,
) {
    const slot = _slot ?? defaultSlot;

    /* istanbul ignore else */
    if (slot) {
        ctx.child(new CoreWatch({ model: $model, slot: safe(slot) }, ctx.runner, ctx.sDeep + 1));
    }
}

export interface DelayOptions<
    Node,
    Element,
    TagOptions extends object,
    Context extends Fragment<Node, Element, TagOptions>,
> {
    time?: number;
    slot?: (ctx: Context) => unknown;
}

export function Delay<
    Node,
    Element,
    TagOptions extends object,
    Context extends Fragment<Node, Element, TagOptions> = Fragment<Node, Element, TagOptions>,
>(
    { time, slot: _slot }: DelayOptions<Node, Element, TagOptions, Context>,
    ctx: Context,
    defaultSlot?: (ctx: Context) => void,
    createContext = (ctx: Context) => new Fragment<Node, Element, TagOptions>(ctx.runner, ctx.sDeep + 1),
) {
    const fragment = createContext(ctx);
    const slot = _slot ?? defaultSlot;
    let timer: number | undefined;

    ctx.child(fragment, function (node: Context) {
        /* istanbul ignore else */
        if (slot) {
            timer = setTimeout(() => {
                safe(slot)(node);
                timer = undefined;
            }, time) as unknown as number;
        }
        node.runOnDestroy(() => {
            if (timer !== undefined) {
                clearTimeout(timer);
            }
        });
    });
}

export interface ZombieOptions<Extra = unknown> {
    $time: IValue<number, Extra>;
    trigger(): void;
}

export function Zombie<Node, Element, TagOptions extends object>(
    { $time, trigger }: ZombieOptions,
    ctx: Fragment<Node, Element, TagOptions>,
    defaultSlot?: (ctx: Fragment<Node, Element, TagOptions>) => void,
) {
    ctx.child(new CoreZombie<Node, Element, TagOptions>(ctx.runner, $time, trigger), defaultSlot);
}

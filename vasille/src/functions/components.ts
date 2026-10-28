import { ReadableIValue, WritableIValue } from "../classes/core/ivalue.js";
import {
    ArrayModel,
    ArrayModelViewNode,
    Fragment,
    IValue,
    MapModel,
    MapViewNode,
    reportError,
    IRunner,
    safe,
    SetModel,
    SetViewNode,
    ArrayViewNode,
    SwitchedNode,
    userError,
    WatchNode,
    ZombieNode,
} from "../classes/index.js";
import { Watch } from "./index.js";
import { ref } from "./internal.js";

export interface SlotOptions<Node, Element, TagOptions extends object, T extends object> {
    model?: (input: T, ctx: Fragment<Node, Element, TagOptions>) => void;
    slot?: (input: object, ctx: Fragment<Node, Element, TagOptions>) => void;
}

function frag<Node, Element, TagOptions extends object, TRunner extends IRunner<Node, Element, TagOptions>>(
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
        $case: ReadableIValue<unknown, unknown>;
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
    T extends
        | Set<unknown>
        | SetModel<unknown, unknown>
        | Map<unknown, unknown>
        | MapModel<unknown, unknown, unknown>
        | unknown[]
        | ArrayModel<unknown, unknown>,
    K = T extends unknown[]
        ? number
        : T extends ArrayModel<unknown, unknown>
          ? number
          : T extends Set<infer R>
            ? R
            : T extends SetModel<infer R, unknown>
              ? R
              : T extends Map<infer R, unknown>
                ? R
                : T extends MapModel<infer R, unknown, unknown>
                  ? R
                  : never,
    V = T extends (infer R)[]
        ? R
        : T extends Set<infer R>
          ? R
          : T extends Map<unknown, infer R>
            ? R
            : T extends ArrayModel<infer R, unknown>
              ? R
              : T extends SetModel<infer R, unknown>
                ? R
                : T extends MapModel<unknown, infer R, unknown>
                  ? R
                  : never,
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
            new ArrayModelViewNode<V, Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, unknown>(
                ctx.runner,
                ctx.sDeep + 1,
                model as ArrayModel<V, unknown>,
                (ctx, value, index) => {
                    slot(ctx, value as V, index.V as K);
                },
                false,
                ref,
                frag,
            ),
        );
    } else if (model instanceof MapModel) {
        ctx.child(
            new MapViewNode<K, V, Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, unknown>(
                ctx.runner,
                ctx.sDeep + 1,
                model as MapModel<K, V, unknown>,
                (ctx, iValue, key) => {
                    Watch(
                        {
                            r_model: iValue,
                            slot(ctx, value) {
                                slot(ctx, value, key);
                            },
                        },
                        ctx,
                    );
                },
                false,
                ref,
                frag,
            ),
        );
    } else if (model instanceof SetModel) {
        ctx.child(
            new SetViewNode<V, Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, unknown>(
                ctx.runner,
                ctx.sDeep + 1,
                model as SetModel<V, unknown>,
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

export function ArrayViewFn<
    Node,
    Element,
    TagOptions extends object,
    T extends unknown[],
    V = T extends (infer R)[] ? R : never,
>(
    props: {
        r_of: ReadableIValue<V[], unknown>;
        key: (value: V) => number | string;
        slot: (
            ctx: Fragment<Node, Element, TagOptions>,
            value: ReadableIValue<V, unknown>,
            index: ReadableIValue<number, unknown>,
        ) => void;
    },
    ctx: Fragment<Node, Element, TagOptions>,
) {
    ctx.child(
        new ArrayViewNode<V, Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, unknown>(
            ctx.runner,
            ctx.sDeep + 1,
            props.r_of,
            props.key,
            props.slot,
            ref,
            ref,
            frag,
        ),
    );
}

export interface WritableViewOptions<Node, Element, TagOptions extends object, T, Args extends unknown[]>
    extends Required<ForOptions<Node, Element, TagOptions, T, Args>> {
    writable: boolean;
}
export function ArrayModelView<Node, Element, TagOptions extends object, V, Extra>(
    props: WritableViewOptions<Node, Element, TagOptions, ArrayModel<V, Extra>, [V, IValue<number, unknown>]>,
    ctx: Fragment<Node, Element, TagOptions>,
) {
    ctx.child(
        new ArrayModelViewNode<V, Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, unknown>(
            ctx.runner,
            ctx.sDeep + 1,
            props.of,
            props.slot,
            props.writable,
            ref,
            frag,
        ),
    );
}

export function MapModelView<Node, Element, TagOptions extends object, K, V>(
    props: WritableViewOptions<Node, Element, TagOptions, MapModel<K, V, unknown>, [WritableIValue<V, unknown>, K]>,
    ctx: Fragment<Node, Element, TagOptions>,
) {
    ctx.child(
        new MapViewNode<K, V, Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, unknown>(
            ctx.runner,
            ctx.sDeep + 1,
            props.of,
            props.slot,
            props.writable,
            ref,
            frag,
        ),
    );
}

export function SetModelView<Node, Element, TagOptions extends object, V>(
    props: Required<ForOptions<Node, Element, TagOptions, SetModel<V, unknown>, [V]>>,
    ctx: Fragment<Node, Element, TagOptions>,
) {
    ctx.child(
        new SetViewNode<V, Node, Element, TagOptions, IRunner<Node, Element, TagOptions>, unknown>(
            ctx.runner,
            ctx.sDeep + 1,
            props.of,
            props.slot,
            frag,
        ),
    );
}

export interface WatchOptions<Node, Element, TagOptions extends object, T, Extra = unknown> {
    r_model: ReadableIValue<T, Extra>;
    slot?: (ctx: Fragment<Node, Element, TagOptions>, value: T) => void;
}

export function WatchFn<Node, Element, TagOptions extends object, T>(
    { r_model, slot: _slot }: WatchOptions<Node, Element, TagOptions, T>,
    ctx: Fragment<Node, Element, TagOptions>,
    defaultSlot?: (ctx: Fragment<Node, Element, TagOptions>) => void,
) {
    const slot = _slot ?? defaultSlot;

    /* istanbul ignore else */
    if (slot) {
        ctx.child(new WatchNode({ model: r_model, slot: safe(slot) }, ctx.runner, ctx.sDeep + 1));
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
    r_time: ReadableIValue<number, Extra>;
    trigger(): void;
}

export function ZombieFn<Node, Element, TagOptions extends object>(
    { r_time, trigger }: ZombieOptions,
    ctx: Fragment<Node, Element, TagOptions>,
    defaultSlot?: (ctx: Fragment<Node, Element, TagOptions>) => void,
) {
    ctx.child(new ZombieNode<Node, Element, TagOptions>(ctx.runner, r_time, trigger), defaultSlot);
}

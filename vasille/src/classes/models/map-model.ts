import { Reactive } from "../core/core.js";
import { WritableIValue } from "../core/ivalue.js";
import { safe } from "../functional/safety.js";
import { Fragment } from "../node/node.js";
import { IRunner } from "../node/runner.js";
import { SyncedIValue } from "../value/synced.js";
import { Collection } from "./collection.js";
import { Listener, removeFragmentFromTree } from "./listener.js";

const enum Ops {
    Clear,
    Add,
    Remove,
}

type Arguments<K, T> = [Ops.Clear] | [Ops.Remove, K] | [Ops.Add, K, T];

/**
 * A `Map` based memory
 * @class MapModel
 * @extends Map
 */
export class MapModel<K, T, Extra> extends Collection<[K, T][] | Map<K, T> | undefined, Map<K, T>> {
    public readonly listener: Listener<Arguments<K, T>>;
    public readonly size?: WritableIValue<number, unknown>;

    /**
     * Constructs a map model
     * @param data {[*, *][]} input data
     * @param ctx lifetime context
     */
    public constructor(
        data?: [K, T][] | Map<K, T> | WritableIValue<[K, T][] | Map<K, T> | undefined, unknown>,
        ctx?: Reactive,
        size?: WritableIValue<number, Extra>,
    ) {
        super(v => new Map(v), data, ctx);
        this.listener = new Listener();

        if (size) {
            this.size = size;
            size.up(this.d.size);
        }
    }

    public get map(): ReadonlyMap<K, T> {
        return this.d;
    }

    /**
     * Calls `Map.clear` and notify about changes
     */
    public clear(): void {
        this.listener.emit(Ops.Clear);
        this.run(() => this.d.clear());
    }

    /**
     * Calls `Map.delete` and notify abut changes
     * @param key {*} key
     * @return {boolean} true if removed something, otherwise false
     */
    public delete(key: K): boolean {
        this.listener.emit(Ops.Remove, key);
        return this.run(() => this.d.delete(key));
    }

    /**
     * Calls `Map.set` and notify abut changes
     * @param key {*} key
     * @param value {*} value
     * @return {MapModel} a pointer to this
     */
    public set(key: K, value: T): this {
        this.listener.emit(Ops.Add, key, value);
        return this.run(() => {
            this.d.set(key, value);
            return this;
        });
    }

    protected run<T>(fn: () => T): T {
        const result = fn();
        const r = this.r;

        this.size?.up(this.d.size);
        r?.up((this.last = r.V instanceof Array ? [...this.d] : new Map(this.d)));
        return result;
    }

    protected override reset(next: Map<K, T> | [K, T][] | undefined) {
        this.listener.emit(Ops.Clear);
        this.d.clear();
        if (next) {
            for (const [key, value] of next) {
                this.listener.emit(Ops.Add, key, value);
                this.d.set(key, value);
            }
        }
        this.size?.up(this.d.size);
    }
}

class WritableMapValue<K, T, Extra> extends SyncedIValue<T, Extra> implements WritableIValue<T, Extra> {
    public constructor(
        ctx: Reactive,
        public readonly model: MapModel<K, T, Extra>,
        public readonly key: K,
        ref: <T>(v: T, ctx?: Reactive) => WritableIValue<T, Extra>,
    ) {
        super(ref(model.map.get(key)!, ctx), ctx);
    }

    public get V(): T {
        return this.sync.V;
    }

    public set V(v: T) {
        this.up(v);
    }

    public up(v: T, arg?: Extra) {
        if (v !== this.sync.V) {
            this.sync.up(v, arg);
            this.model.set(this.key, v);
        }

        return v;
    }
}

export class MapViewNode<
    K,
    T,
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
    Extra,
> extends Fragment<Node, Element, TagOptions, Runner> {
    private map = new Map<
        K,
        {
            frag: Fragment<Node, Element, TagOptions, Runner>;
            value: WritableIValue<T, unknown>;
        }
    >();
    private acceptUpdate: ((...args: Arguments<K, T>) => void) | undefined;
    private readonly slot: (
        ctx: Fragment<Node, Element, TagOptions, Runner>,
        value: WritableIValue<T, unknown>,
        key: K,
    ) => void;

    public constructor(
        runner: Runner,
        deep: number,
        private readonly model: MapModel<K, T, Extra>,
        slot: (ctx: Fragment<Node, Element, TagOptions, Runner>, value: WritableIValue<T, unknown>, key: K) => void,
        private readonly writable: boolean,
        private readonly ref: <T>(v: T, ctx?: Reactive) => WritableIValue<T, unknown>,
        private readonly frag: (runner: Runner, deep: number) => Fragment<Node, Element, TagOptions, Runner>,
    ) {
        super(runner, deep);
        this.slot = safe(slot);
    }

    public override compose() {
        const view = this;

        function create(this: void, key: K, value: T) {
            const frag = view.frag(view.runner, view.sDeep + 1);
            const ref = view.writable ? new WritableMapValue(frag, view.model, key, view.ref) : view.ref(value, frag);

            frag.link(view, view.last, undefined);
            view.slot(frag, ref, key);
            view.map.set(key, { frag, value: ref });
            view.last = frag;
        }
        function acceptUpdate(this: void, op: Ops, key?: K, value?: T) {
            if (op === Ops.Add) {
                const existing = view.map.get(key!);

                if (existing) {
                    existing.value.up(value!);
                } else {
                    create(key!, value!);
                }
            } else if (op === Ops.Remove) {
                const item = view.map.get(key!);

                /* istanbul ignore else */
                if (item) {
                    removeFragmentFromTree(item.frag);
                    item.frag.destroy(item.frag.sDeep);
                    view.map.delete(key!);
                }
            } else {
                view.map.forEach(({ frag }) => frag.destroy(frag.sDeep));
                view.map.clear();
                view.last = undefined;
            }
        }

        this.model.map.forEach((value, key) => create(key, value));
        this.model.listener.on(acceptUpdate);
        this.acceptUpdate = acceptUpdate;
    }

    public override unmount(keepStructure: boolean) {
        super.unmount(keepStructure);
        this.map.forEach(item => item.frag.unmount(true));
    }
    public override remount() {
        [...this.map.values()].reverse().forEach(item => item.frag.remount());
    }

    public override destroy(deep: number, keepNodes?: boolean): void {
        /* istanbul ignore else */
        if (this.acceptUpdate && this.model.rDeep < deep) {
            this.model.listener.off(this.acceptUpdate);
        }
        this.map.forEach(({ frag }) => {
            /* istanbul ignore else */
            if (frag.rDeep < deep || !keepNodes) {
                frag.destroy(deep, keepNodes);
            }
        });
        super.destroy(deep, keepNodes);
    }
}

import { Reactive } from "../core/core.js";
import { WritableIValue } from "../core/ivalue.js";
import { safe } from "../functional/safety.js";
import { Fragment, Root } from "../node/node.js";
import { IRunner } from "../node/runner.js";
import { SyncedIValue } from "../value/synced.js";
import { Collection } from "./collection.js";
import { Listener, removeFragmentFromTree } from "./listener.js";

const Clear = 0,
    Add = 1,
    Remove = 2;

type Arguments<K, T> = [typeof Clear] | [typeof Remove, K] | [typeof Add, K, T];
type Ops = typeof Clear | typeof Remove | typeof Add;

/**
 * A `Map` based memory
 * @class MapModel
 */
export class MapModel<K, T, Extra> extends Collection<[K, T][] | Map<K, T> | undefined, Map<K, T>> {
    public readonly listener: Listener<Arguments<K, T>>;
    public readonly size?: WritableIValue<number, unknown>;

    /**
     * Constructs a map model
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
            size.up(this.l.size);
        }
    }

    public get map(): ReadonlyMap<K, T> {
        return this.l;
    }

    /**
     * Calls `Map.clear` and notify about changes
     */
    public clear(): void {
        this.listener.emit(Clear);
        this.run(() => this.l.clear());
    }

    /**
     * Calls `Map.delete` and notify abut changes
     * @param key {*} key
     * @return {boolean} true if removed something, otherwise false
     */
    public delete(key: K): boolean {
        this.listener.emit(Remove, key);
        return this.run(() => this.l.delete(key));
    }

    /**
     * Calls `Map.set` and notify abut changes
     * @param key {*} key
     * @param value {*} value
     * @return {MapModel} a pointer to this
     */
    public set(key: K, value: T): this {
        this.listener.emit(Add, key, value);
        return this.run(() => {
            this.l.set(key, value);
            return this;
        });
    }

    protected run<T>(fn: () => T): T {
        const result = fn();
        const r = this.r;

        this.size?.up(this.l.size);
        r?.up((this.last = r.V instanceof Array ? [...this.l] : new Map(this.l)));
        return result;
    }

    protected override reset(next: Map<K, T> | [K, T][] | undefined) {
        this.listener.emit(Clear);
        this.l.clear();
        /* istanbul ignore else */
        if (next) {
            for (const [key, value] of next) {
                this.listener.emit(Add, key, value);
                this.l.set(key, value);
            }
        }
        this.size?.up(this.l.size);
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

    public override isWritable(): this is WritableIValue<T, Extra> {
        return true;
    }
}

export class MapViewNode<
    K,
    T,
    Node,
    Element extends Node,
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
        parent: Root<Node, Element, TagOptions, Runner>,
        private readonly model: MapModel<K, T, Extra>,
        slot: (ctx: Fragment<Node, Element, TagOptions, Runner>, value: WritableIValue<T, any>, key: K) => void,
        private readonly writable: boolean,
        private readonly ref: <T>(v: T, ctx?: Reactive) => WritableIValue<T, unknown>,
        private readonly frag: (
            parent: Root<Node, Element, TagOptions, Runner>,
        ) => Fragment<Node, Element, TagOptions, Runner>,
    ) {
        super(parent);
        this.slot = safe(slot);
    }

    public override compose() {
        const view = this;

        function create(this: void, key: K, value: T) {
            const frag = view.frag(view);
            const ref = view.writable ? new WritableMapValue(frag, view.model, key, view.ref) : view.ref(value, frag);

            frag.link(view.last, undefined);
            view.slot(frag, ref, key);
            view.map.set(key, { frag, value: ref });
            view.last = frag;
        }
        function acceptUpdate(this: void, op: Ops, key?: K, value?: T) {
            if (op === Add) {
                const existing = view.map.get(key!);

                if (existing) {
                    existing.value.up(value!);
                } else {
                    create(key!, value!);
                }
            } else if (op === Remove) {
                const item = view.map.get(key!);

                /* istanbul ignore else */
                if (item) {
                    removeFragmentFromTree(item.frag);
                    item.frag.d(item.frag.pos);
                    view.map.delete(key!);
                }
            } else {
                view.map.forEach(({ frag }) => frag.d(frag.pos));
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

    public override d(deep: number, keepNodes?: boolean): void {
        /* istanbul ignore else */
        if (this.acceptUpdate && this.model.deep < deep) {
            this.model.listener.off(this.acceptUpdate);
        }
        this.map.forEach(({ frag }) => {
            /* istanbul ignore else */
            if (frag.deep < deep || !keepNodes) {
                frag.d(deep, keepNodes);
            }
        });
        super.d(deep, keepNodes);
    }
}

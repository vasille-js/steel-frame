import { Reactive } from "../core/core.js";
import { WritableIValue } from "../core/ivalue.js";
import { safe } from "../functional/safety.js";
import { Fragment } from "../node/node.js";
import { IRunner } from "../node/runner.js";
import { Reference } from "../value/reference.js";
import { Collection } from "./collection.js";
import { Listener, removeFragmentFromTree } from "./listener.js";

const enum Ops {
    Clear,
    Add,
    Remove,
}

type Arguments<T> = [Ops.Clear] | [Ops.Remove, T] | [Ops.Add, T];

/**
 * A `Set` based model
 * @class SetModel
 * @extends Set
 */
export class SetModel<T, Extra> extends Collection<T[] | Set<T> | undefined, Set<T>> {
    public readonly listener: Listener<Arguments<T>>;
    public readonly size?: WritableIValue<number, unknown>;

    /**
     * Constructs a set model based on a set
     */
    public constructor(
        data?: T[] | Set<T> | Reference<T[] | Set<T> | undefined, unknown>,
        ctx?: Reactive,
        size?: WritableIValue<number, Extra>,
    ) {
        super(v => new Set(v), data, ctx);
        this.listener = new Listener();

        if (size) {
            this.size = size;
            size.up(this.d.size);
        }
    }

    public get set(): ReadonlySet<T> {
        return this.d;
    }

    /* Set mutate members */

    /**
     * Calls `Set.add` and notify abut changes
     * @param value {*} value
     * @return {this} a pointer to this
     */
    public add(value: T): this {
        this.listener.emit(Ops.Add, value);
        return this.run(() => {
            this.d.add(value);
            return this;
        });
    }

    /**
     * Calls `Set.clear` and notify about changes
     */
    public clear() {
        this.listener.emit(Ops.Clear);
        this.run(() => this.d.clear());
    }

    /**
     * Calls `Set.delete` and notify about changes
     * @param value {*}
     * @return {boolean} true if a value was deleted, otherwise false
     */
    public delete(value: T): boolean {
        this.listener.emit(Ops.Remove, value);
        return this.run(() => this.d.delete(value));
    }

    protected override reset(next: Set<T> | Array<T> | undefined) {
        this.listener.emit(Ops.Clear);
        this.d.clear();
        next?.forEach((value: T) => {
            this.listener.emit(Ops.Add, value);
            this.d.add(value);
        });
        this.size?.up(this.d.size);
    }

    protected run<T>(fn: () => T): T {
        const result = fn();
        const r = this.r;

        this.size?.up(this.d.size);
        if (r) {
            r.up((this.last = r.V instanceof Array ? [...this.d] : new Set(this.d)));
        }

        return result;
    }
}

export class SetViewNode<
    T,
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
    Extra,
> extends Fragment<Node, Element, TagOptions, Runner> {
    private map = new Map<T, Fragment<Node, Element, TagOptions, Runner>>();
    private acceptUpdate: ((...args: Arguments<T>) => void) | undefined;
    private readonly slot: (ctx: Fragment<Node, Element, TagOptions, Runner>, value: T) => void;

    public constructor(
        runner: Runner,
        deep: number,
        private readonly model: SetModel<T, Extra>,
        slot: (ctx: Fragment<Node, Element, TagOptions, Runner>, value: T) => void,
        private readonly frag: (runner: Runner, deep: number) => Fragment<Node, Element, TagOptions, Runner>,
    ) {
        super(runner, deep);
        this.slot = safe(slot);
    }

    public override compose() {
        const view = this;

        function create(this: void, value: T) {
            const frag = view.frag(view.runner, view.sDeep + 1);

            frag.link(view, view.last, undefined);
            view.slot(frag, value);
            view.map.set(value, frag);
            view.last = frag;
        }
        function acceptUpdate(op: Ops, value?: T) {
            if (op === Ops.Add) {
                const existing = view.map.get(value!);

                if (existing) {
                    removeFragmentFromTree(existing);
                    existing.destroy(existing.sDeep);
                }
                create(value!);
            } else if (op === Ops.Remove) {
                const item = view.map.get(value!);

                /* istanbul ignore else */
                if (item) {
                    removeFragmentFromTree(item);
                    item.destroy(item.sDeep);
                }
            } else {
                view.map.forEach(frag => frag.destroy(frag.sDeep));
                view.map.clear();
                view.last = undefined;
            }
        }

        this.model.set.forEach(value => create(value));
        this.model.listener.on(acceptUpdate);
        this.acceptUpdate = acceptUpdate;
    }

    public override unmount(keepStructure: boolean) {
        super.unmount(keepStructure);
        this.map.forEach(item => item.unmount(true));
    }
    public override remount() {
        [...this.map.values()].reverse().forEach(item => item.remount());
    }

    public override destroy(deep: number, keepNodes?: boolean): void {
        /* istanbul ignore else */
        if (this.acceptUpdate && this.model.rDeep < deep) {
            this.model.listener.off(this.acceptUpdate);
        }
        this.map.forEach(frag => {
            /* istanbul ignore else */
            if (frag.rDeep < deep || !keepNodes) {
                frag.destroy(deep, keepNodes);
            }
        });
        super.destroy(deep, keepNodes);
    }
}

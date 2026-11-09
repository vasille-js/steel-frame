import { Reactive } from "../core/core.js";
import { WritableIValue } from "../core/ivalue.js";
import { safe } from "../functional/safety.js";
import { Fragment, Root } from "../node/node.js";
import { IRunner } from "../node/runner.js";
import { Collection } from "./collection.js";
import { Listener, removeFragmentFromTree } from "./listener.js";

const Clear = 0,
    Add = 1,
    Remove = 2;

type Arguments<T> = [typeof Clear] | [typeof Remove, T] | [typeof Add, T];
type Ops = typeof Clear | typeof Remove | typeof Add;

/**
 * A `Set` based model
 * @class SetModel
 */
export class SetModel<T, Extra> extends Collection<T[] | Set<T> | undefined, Set<T>> {
    public readonly listener: Listener<Arguments<T>>;
    public readonly size?: WritableIValue<number, unknown>;

    /**
     * Constructs a set model based on a set
     */
    public constructor(
        data?: T[] | Set<T> | WritableIValue<T[] | Set<T> | undefined, unknown>,
        ctx?: Reactive,
        size?: WritableIValue<number, Extra>,
    ) {
        super(v => new Set(v), data, ctx);
        this.listener = new Listener();

        if (size) {
            this.size = size;
            size.up(this.l.size);
        }
    }

    public get set(): ReadonlySet<T> {
        return this.l;
    }

    /* Set mutate members */

    /**
     * Calls `Set.add` and notify abut changes
     * @param value {*} value
     * @return {this} a pointer to this
     */
    public add(value: T): this {
        this.listener.emit(Add, value);
        return this.run(() => {
            this.l.add(value);
            return this;
        });
    }

    /**
     * Calls `Set.clear` and notify about changes
     */
    public clear() {
        this.listener.emit(Clear);
        this.run(() => this.l.clear());
    }

    /**
     * Calls `Set.delete` and notify about changes
     * @param value {*}
     * @return {boolean} true if a value was deleted, otherwise false
     */
    public delete(value: T): boolean {
        this.listener.emit(Remove, value);
        return this.run(() => this.l.delete(value));
    }

    protected override reset(next: Set<T> | Array<T> | undefined) {
        this.listener.emit(Clear);
        this.l.clear();
        next?.forEach((value: T) => {
            this.listener.emit(Add, value);
            this.l.add(value);
        });
        this.size?.up(this.l.size);
    }

    protected run<T>(fn: () => T): T {
        const result = fn();
        const r = this.r;

        this.size?.up(this.l.size);
        if (r) {
            r.up((this.last = r.V instanceof Array ? [...this.l] : new Set(this.l)));
        }

        return result;
    }
}

export class SetViewNode<
    T,
    Node,
    Element extends Node,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
    Extra,
> extends Fragment<Node, Element, TagOptions, Runner> {
    private map = new Map<T, Fragment<Node, Element, TagOptions, Runner>>();
    private acceptUpdate: ((...args: Arguments<T>) => void) | undefined;
    private readonly slot: (ctx: Fragment<Node, Element, TagOptions, Runner>, value: T) => void;

    public constructor(
        parent: Root<Node, Element, TagOptions, Runner>,
        private readonly model: SetModel<T, Extra>,
        slot: (ctx: Fragment<Node, Element, TagOptions, Runner>, value: T) => void,
        private readonly frag: (
            parent: Root<Node, Element, TagOptions, Runner>,
        ) => Fragment<Node, Element, TagOptions, Runner>,
    ) {
        super(parent);
        this.slot = safe(slot);
    }

    public override compose() {
        const view = this;

        function create(this: void, value: T) {
            const frag = view.frag(view);

            frag.link(view.last, undefined);
            view.slot(frag, value);
            view.map.set(value, frag);
            view.last = frag;
        }
        function acceptUpdate(op: Ops, value?: T) {
            if (op === Add) {
                const existing = view.map.get(value!);

                if (existing) {
                    removeFragmentFromTree(existing);
                    existing.d(existing.pos);
                }
                create(value!);
            } else if (op === Remove) {
                const item = view.map.get(value!);

                /* istanbul ignore else */
                if (item) {
                    removeFragmentFromTree(item);
                    item.d(item.pos);
                }
            } else {
                view.map.forEach(frag => frag.d(frag.pos));
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

    public override d(deep: number, keepNodes?: boolean): void {
        /* istanbul ignore else */
        if (this.acceptUpdate && this.model.deep < deep) {
            this.model.listener.off(this.acceptUpdate);
        }
        this.map.forEach(frag => {
            /* istanbul ignore else */
            if (frag.deep < deep || !keepNodes) {
                frag.d(deep, keepNodes);
            }
        });
        super.d(deep, keepNodes);
    }
}

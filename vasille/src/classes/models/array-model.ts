import { Reactive } from "../core/core.js";
import { ReadableIValue, WritableIValue } from "../core/ivalue.js";
import { safe } from "../functional/safety.js";
import { Fragment } from "../node/node.js";
import { IRunner } from "../node/runner.js";
import { SyncedIValue } from "../value/synced.js";
import { Collection } from "./collection.js";
import { Listener } from "./listener.js";

type Arguments<T> = [number, number, T[]] | [number, number];

/**
 * Model based on Array class
 * @extends Array
 */
export class ArrayModel<T, Extra> extends Collection<T[] | undefined, T[]> {
    public readonly listener: Listener<Arguments<T>>;
    public readonly length?: WritableIValue<number, unknown>;

    /**
     * @param data {Array} input data
     * @param ctx lifetime context of model
     */
    public constructor(
        data?: T[] | WritableIValue<T[], unknown>,
        ctx?: Reactive,
        length?: WritableIValue<number, Extra>,
    ) {
        super(arr => (arr ? [...arr] : []), data, ctx);
        this.listener = new Listener();
        ctx?.bind(this);

        if (length) {
            this.length = length;
            length.up(this.d.length);
        }
    }

    /**
     * Give read access to the encapsulated array
     */
    public get array(): readonly T[] {
        return this.d;
    }

    /* Array mutate members */

    /**
     * Calls `Array.pop` and notify about changes
     * @return {*} removed value
     */
    public pop(): T | undefined {
        /* istanbul ignore else */
        if (this.d.length > 0) {
            this.listener.emit(this.d.length - 1, 1);

            return this.run(() => this.d.pop());
        }
    }

    /**
     * Calls `Array.push` and notify about changes
     * @param items {...*} values to push
     * @return {number} new length of the array
     */
    public push(...items: Array<T>): number {
        this.listener.emit(this.d.length, 0, items);
        return this.run(() => this.d.push(...items));
    }

    /**
     * Calls `Array.shift` and notify about changed
     * @return {*} the shifted value
     */
    public shift(): T | undefined {
        /* istanbul ignore else */
        if (this.d.length > 0) {
            this.listener.emit(0, 1);
            return this.run(() => this.d.shift());
        }
    }

    /**
     * Calls `Array.sort` and notify about changed
     * `a - b` in ascending order
     * `b - a` in descending order
     * @param compareFn {?function} compare function
     * @return {ArrayModel} a pointer to this
     */
    public sort(compareFn?: (a: T, b: T) => number): this {
        return this.run(() => {
            const data = this.d;
            data.sort(compareFn);
            this.listener.emit(0, data.length, data);
            return this;
        });
    }

    /**
     * Calls `Array.splice` and notify about changed
     * @param start {number} start index
     * @param deleteCount {?number} delete count
     * @param items {...*}
     * @return {ArrayModel} a pointer to this
     */
    public splice(start: number, deleteCount?: number, ...items: Array<T>): T[] {
        return this.run(() => {
            const startIndex = Math.min(start, this.d.length);
            const removeCount = typeof deleteCount === "number" ? deleteCount : this.d.length - startIndex;
            this.listener.emit(startIndex, removeCount, items);
            return this.d.splice(startIndex, removeCount, ...items);
        });
    }

    /**
     * Calls Array.unshift and notify about changed
     * @param items {...*} values to insert
     * @return {number} the length after prepending
     */
    public unshift(...items: Array<T>): number {
        this.listener.emit(0, 0, items);
        return this.run(() => this.d.unshift(...items));
    }

    /**
     * Replace item at index `at` with `with_`
     * @param at {number} index of item to replace
     * @param with_ {*} new value
     * @return {ArrayModel} a pointer to this
     */
    public replace(at: number, with_: T): this {
        return this.run(() => {
            this.listener.emit(at, 1, [with_]);
            this.d[at] = with_;
            return this;
        });
    }

    protected run<T>(fn: () => T): T {
        const result = fn();
        this.length?.up(this.d.length);
        this.r?.up((this.last = [...this.d]));
        return result;
    }

    protected override reset(arr: T[] | undefined) {
        const newArr = arr ? [...arr] : [];
        const length = this.d.length;

        this.listener.emit(0, length, newArr);
        this.d.splice(0, length, ...newArr);
        this.length?.up(newArr.length);
    }
}

interface CacheItem<
    T,
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
    Extra,
    Writable extends WritableIValue<T, Extra> = WritableIValue<T, Extra>,
> {
    frag: Fragment<Node, Element, TagOptions, Runner>;
    index: WritableIValue<number, Extra>;
    writable?: Writable;
}

class BaseArrayView<
    T,
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
    Extra extends unknown,
    CacheItemType extends CacheItem<T, Node, Element, TagOptions, Runner, Extra>,
> extends Fragment<Node, Element, TagOptions, Runner> {
    protected cache: CacheItemType[] = [];

    public override unmount(keepStructure: boolean) {
        super.unmount(keepStructure);
        this.cache.forEach(item => item.frag.unmount(true));
    }
    public override remount() {
        for (let i = this.cache.length - 1; i >= 0; i--) {
            this.cache[i]!.frag.remount();
        }
    }

    public override destroy(deep: number, keepNodes?: boolean): void {
        for (let i = this.cache.length - 1; i >= 0; i--) {
            const frag = this.cache[i]!.frag;
            /* istanbul ignore else */
            if (!keepNodes || frag.sDeep < deep) {
                frag.destroy(deep, keepNodes);
            }
        }
        super.destroy(deep, keepNodes);
    }
}

class WritableArrayItem<T, Extra> extends SyncedIValue<T, Extra> implements WritableIValue<T, Extra> {
    public constructor(
        ctx: Reactive,
        public readonly model: ArrayModel<T, Extra>,
        public readonly index: ReadableIValue<number, Extra>,
        ref: <T>(v: T, ctx?: Reactive) => WritableIValue<T, Extra>,
    ) {
        super(ref(model.array[index.V]!, ctx), ctx);
    }

    public get V(): T {
        return this.sync.V;
    }

    public set V(v: T) {
        this.up(v);
    }

    // called by user, update of the model required
    public up(v: T, arg?: Extra) {
        if (v !== this.sync.V) {
            this.sync.up(v, arg);
            this.model.replace(this.index.V, v);
        }

        return v;
    }

    // called from ArrayModelView, update of the model dues to infinite loop
    public upSync(v: T): void {
        this.sync.up(v);
    }
}

export class ArrayModelViewNode<
    T,
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
    Extra extends unknown,
> extends BaseArrayView<
    T,
    Node,
    Element,
    TagOptions,
    Runner,
    Extra,
    CacheItem<T, Node, Element, TagOptions, Runner, Extra, WritableArrayItem<T, Extra>>
> {
    private apply: ((...args: Arguments<T>) => void) | undefined;
    private readonly slot: (
        ctx: Fragment<Node, Element, TagOptions, Runner>,
        value: T | WritableIValue<T, Extra>,
        index: ReadableIValue<number, Extra>,
    ) => void;

    public constructor(
        runner: Runner,
        deep: number,
        private readonly model: ArrayModel<T, Extra>,
        slot: (
            ctx: Fragment<Node, Element, TagOptions, Runner>,
            value: T | WritableIValue<T, Extra>,
            index: ReadableIValue<number, Extra>,
        ) => void,
        private readonly writable: boolean,
        private readonly ref: <T>(v: T, ctx?: Reactive) => WritableIValue<T, Extra>,
        private readonly frag: (runner: Runner, deep: number) => Fragment<Node, Element, TagOptions, Runner>,
    ) {
        super(runner, deep);
        this.slot = safe(slot);
    }

    public override compose() {
        const view = this;

        function apply(this: void, index: number, remove: number, values?: readonly T[]) {
            const children = view.cache;
            const toInsert: CacheItem<T, Node, Element, TagOptions, Runner, Extra, WritableArrayItem<T, Extra>>[] = [];
            const prev = children[index - 1]?.frag;
            const next = children[index + remove]?.frag;
            const length = values?.length || 0;
            const lastIndex = length - 1;

            if (length === remove && view.writable) {
                // update writable values, better performance
                for (let i = 0; i < length; i++) {
                    children[index + i]!.writable!.V = values![i]!;
                }
                return;
            }

            // create new fragments
            for (let i = 0; i < length; i++) {
                const ctx = view.frag(view.runner, view.sDeep + 1);
                const inserted: CacheItem<T, Node, Element, TagOptions, Runner, Extra> = (toInsert[i] = {
                    frag: ctx,
                    index: view.ref(i + index, ctx),
                });
                if (view.writable) {
                    inserted.writable = new WritableArrayItem(ctx, view.model, inserted.index, view.ref);
                }
            }
            // locate new fragments
            for (let i = 0; i < length; i++) {
                toInsert[i]!.frag.link(
                    view,
                    i === 0 ? prev : toInsert[i - 1]!.frag,
                    i === lastIndex ? next : toInsert[i + 1]!.frag,
                );
            }

            // destroy removed nodes
            for (let i = 0; i < remove; i++) {
                children[index + i]?.frag.destroy(view.sDeep + 1);
            }

            // modify the cache
            children.splice(index, remove, ...toInsert);

            // update indexes of affected items in the cache
            for (let i = index + length; i < children.length; i++) {
                children[i]!.index.V = i;
            }

            // render new fragments content in reverse order
            for (let i = lastIndex; i >= 0; i--) {
                const item = toInsert[i]!;

                view.slot(item.frag, view.writable ? item.writable! : ((values as T[])[i] as T), item.index);
            }
        }

        apply(0, 0, this.model.array);
        this.model.listener.on(apply);
        this.apply = apply;
    }

    public override destroy(deep: number, keepNodes?: boolean) {
        /* istanbul ignore else */
        if (this.apply && this.model.rDeep < deep) {
            this.model.listener.off(this.apply);
        }
        super.destroy(deep, keepNodes);
    }
}

interface KeyedCacheItem<
    T,
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
    Extra extends unknown,
> extends CacheItem<T, Node, Element, TagOptions, Runner, Extra> {
    key: string | number;
    value: WritableIValue<T, Extra>;
    moved: boolean;
    unmounted: boolean;
}

export class DiffingArrayView<
    T,
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
    Extra extends unknown,
> extends BaseArrayView<
    T,
    Node,
    Element,
    TagOptions,
    Runner,
    Extra,
    KeyedCacheItem<T, Node, Element, TagOptions, Runner, Extra>
> {
    protected match: ((model: T[]) => void) | undefined;
    protected slot: (
        ctx: Fragment<Node, Element, TagOptions, Runner>,
        value: ReadableIValue<T, Extra>,
        index: ReadableIValue<number, Extra>,
    ) => void;

    public constructor(
        runner: Runner,
        deep: number,
        protected readonly model: ReadableIValue<T[], Extra>,
        protected readonly key: (item: T) => number | string,
        slot: (
            ctx: Fragment<Node, Element, TagOptions, Runner>,
            value: ReadableIValue<T, Extra>,
            index: ReadableIValue<number, Extra>,
        ) => void,
        protected readonly vRef: <T>(v: T) => WritableIValue<T, Extra>,
        protected readonly iRef: <T>(v: T) => WritableIValue<T, Extra>,
        protected readonly frag: (runner: Runner, deep: number) => Fragment<Node, Element, TagOptions, Runner>,
    ) {
        super(runner, deep);
        this.slot = safe(slot);
    }

    protected addChild(
        newCache: KeyedCacheItem<T, Node, Element, TagOptions, Runner, Extra>[],
        key: number | string,
        modelItem: T,
        prev?: Fragment<Node, Element, TagOptions, Runner>,
        next?: Fragment<Node, Element, TagOptions, Runner>,
    ) {
        const frag = this.frag(this.runner, this.sDeep + 1);
        const index = this.iRef(newCache.length);
        const value = this.vRef(modelItem);
        const cache: KeyedCacheItem<T, Node, Element, TagOptions, Runner, Extra> = {
            frag: frag,
            key: key,
            value: value,
            moved: false,
            unmounted: false,
            index,
        };

        frag.link(this, prev, next);
        this.slot(frag, value, index);
        newCache.push(cache);

        return cache;
    }

    public override destroy(deep: number, keepNodes?: boolean) {
        /* istanbul ignore else */
        if (this.match && this.model.rDeep < deep) {
            this.model.off(this.match);
        }
        super.destroy(deep, keepNodes);
    }
}

export class ArrayViewNode<
    T,
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions>,
    Extra extends unknown,
> extends DiffingArrayView<T, Node, Element, TagOptions, Runner, Extra> {
    protected readonly existing = new Map<
        number | string,
        KeyedCacheItem<T, Node, Element, TagOptions, Runner, Extra>
    >();

    public override compose() {
        const view = this;
        const { existing } = this;

        function match(model: T[]) {
            const children = view.cache;
            const newCache: KeyedCacheItem<T, Node, Element, TagOptions, Runner, Extra>[] = [];
            const unmounted = new Set<KeyedCacheItem<T, Node, Element, TagOptions, Runner, Extra>>();
            const modelLength = model.length;
            const cacheLength = children.length;
            let modelIndex = 0;
            let cacheIndex = 0;

            while (
                modelIndex <= modelLength &&
                cacheIndex <= cacheLength &&
                !(modelIndex == modelLength && cacheIndex == cacheLength)
            ) {
                const modelItem = model[modelIndex];
                const cacheItem = children[cacheIndex];
                const key = modelItem ? view.key(modelItem) : null;
                const prev = newCache[modelIndex - 1];
                let present: KeyedCacheItem<T, Node, Element, TagOptions, Runner, Extra> | undefined;

                // ideal case, a match
                if (key === cacheItem?.key) {
                    cacheItem.value.V = modelItem!;
                    cacheItem.index.V = modelIndex;
                    newCache.push(cacheItem);
                    modelIndex++;
                    cacheIndex++;
                    continue;
                }

                // skip already unmounted items
                if (cacheItem?.moved || !modelItem) {
                    cacheIndex++;
                    /* istanbul ignore else */
                    if (cacheItem) {
                        if (cacheItem.moved) {
                            cacheItem.moved = false;
                        } else {
                            cacheItem.frag.unlink();
                            unmounted.add(cacheItem);
                            cacheItem.unmounted = true;
                        }
                    }
                }
                // the item is present in another position, move it
                else if ((present = existing.get(key!))) {
                    const frag = present.frag;
                    const presentIndex = present.index;
                    const presentValue = present.value;
                    const indexDiff = presentIndex.V - cacheIndex;
                    const removeLimit = modelLength < cacheLength ? cacheLength - modelLength + 2 : 4;

                    // remove items between if less than 5
                    if (indexDiff <= removeLimit && indexDiff > 0) {
                        while (cacheIndex < presentIndex.V) {
                            const item = children[cacheIndex]!;
                            item.frag.unmount(false);
                            item.unmounted = true;
                            unmounted.add(item);
                            cacheIndex++;
                        }
                    } else {
                        if (!present.unmounted) {
                            frag.unmount(false);
                        }
                        frag.link(view, prev?.frag, cacheItem?.frag);
                        frag.remount();
                        presentIndex.V = modelIndex;
                        presentValue.V = modelItem!;
                        present.moved = indexDiff > 0;
                        newCache.push(present);
                        modelIndex++;

                        // if was unmounted, remove it from the unmounted set
                        if (present.unmounted) {
                            unmounted.delete(present);
                            present.unmounted = false;
                        }
                    }
                }
                // add missing items
                else {
                    /* istanbul ignore else */
                    if (key !== null && modelItem) {
                        existing.set(key, view.addChild(newCache, key, modelItem, prev?.frag, cacheItem?.frag));
                        modelIndex++;
                    }
                }
            }

            // destroy removed nodes
            unmounted.forEach(item => {
                existing.delete(item.key);
                item.frag.destroy(item.frag.sDeep);
            });

            view.cache = newCache;
        }

        match(this.model.V);
        this.model.on(match);
        this.match = match;
    }
}

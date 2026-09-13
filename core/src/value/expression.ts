import { Reactive } from "../core/core.js";
import { Destroyable } from "../core/destroyable.js";
import { safe } from "../functional/safety.js";
import { IValue } from "../core/ivalue.js";
import { SyncedIValue } from "./synced.js";

export type KindOfIValue<T extends unknown[], Extra extends unknown> = {
    [K in keyof T]: IValue<T[K], Extra> | undefined;
};

/**
 * Bind some values to one expression
 * @class Expression
 * @extends IValue
 */
export class Expression<T, Args extends unknown[], Extra extends unknown>
    extends SyncedIValue<T, Extra>
    implements Destroyable
{
    /**
     * The array of value which will trigger recalculation
     * @type {Array}
     */
    protected values: KindOfIValue<Args, Extra>;

    /**
     * Cache the values of expression variables
     * @type {Array}
     */
    protected readonly valuesCache: Args;

    /**
     * Expression will link different handler for each value of the list
     */
    private linkedFunc: Array<() => void> = [];

    /**
     * Creates a function bounded to N values
     */
    public constructor(
        func: (...args: Args) => T,
        ref: (arg: Args) => IValue<T, Extra>,
        values: KindOfIValue<Args, Extra>,
        ctx: Reactive,
    ) {
        const cache = values.map(item => item?.V) as Args;

        super(ref(cache), ctx);

        const handler = this.getHandler(func);
        let i = 0;
        let deep = ctx.sDeep;

        this.valuesCache = cache;
        values.forEach(value => {
            const updater = handler.bind(this, Number(i++));

            if (value && value.rDeep < deep) {
                deep = value.rDeep;
            }
            this.linkedFunc.push(updater);
            value?.on(updater);
        });

        this.values = values;
        this.rDeep = deep;
        if (ctx.sDeep > deep) {
            ctx.bind(this);
        }
    }

    public get V(): T {
        return this.sync.V;
    }

    public set V(value: T) {
        this.up(value);
    }

    public up(value: T, arg?: Extra): T {
        this.destroy();
        return this.sync.up(value, arg);
    }

    public destroy(): void {
        if (this.values.length > 0) {
            for (let i = 0; i < this.values.length; i++) {
                this.values[i]?.off(this.linkedFunc[i]!);
            }
            this.values.splice(0);
            this.valuesCache.splice(0);
            this.linkedFunc.splice(0);
        }
    }

    protected getHandler(func: (...args: Args) => T): (i: number | undefined, value: unknown, extra?: Extra) => void {
        return safe((i: number | undefined, value: unknown) => {
            /* istanbul ignore else */
            if (typeof i === "number") {
                this.valuesCache[i] = value;
            }
            this.sync.V = func.apply(this, this.valuesCache);
        });
    }
}

import { Reactive } from "../core/core.js";
import { Destroyable } from "../core/destroyable.js";
import { WritableIValue } from "../core/ivalue.js";
import { Reference } from "../value/reference.js";

export abstract class Collection<T, D> implements Destroyable {
    public readonly rDeep: number;

    protected readonly d: D;
    protected readonly r: WritableIValue<T, unknown> | undefined;

    declare protected last: T;
    declare protected handler: undefined | ((next: T) => void);

    protected constructor(create: (v: T) => D, data?: T | WritableIValue<T, unknown>, ctx?: Reactive) {
        if (data instanceof Reference) {
            const value = data.V;

            this.d = create(value);
            this.last = value;
            this.r = data;
            data.on(
                (this.handler = next => {
                    if (next !== this.last) {
                        this.reset(next);
                    }
                }),
            );
            this.rDeep = data.rDeep;
        } else {
            this.d = create(data as T);
            this.rDeep = ctx?.sDeep || 0;
        }
        ctx?.bind(this);
    }

    public destroy(deep: number) {
        if (this.rDeep < deep && this.r && this.handler) {
            this.r.off(this.handler);
        }
    }

    protected abstract reset(v: T): void;
}

import { Reactive } from "../core/core.js";
import { Destroyable } from "../core/destroyable.js";
import { WritableIValue } from "../core/ivalue.js";
import { Reference } from "../value/reference.js";

export abstract class Collection<T, List> implements Destroyable {
    public readonly deep: number;

    protected readonly l: List;
    protected readonly r: WritableIValue<T, unknown> | undefined;

    declare protected last: T;
    declare protected handler: undefined | ((next: T) => void);

    protected constructor(create: (v: T) => List, data?: T | WritableIValue<T, unknown>, ctx?: Reactive) {
        if (data instanceof Reference) {
            const value = data.V;

            this.l = create(value);
            this.last = value;
            this.r = data;
            data.on(
                (this.handler = next => {
                    if (next !== this.last) {
                        this.reset(next);
                    }
                }),
            );
            this.deep = data.deep;
        } else {
            this.l = create(data as T);
            this.deep = ctx?.pos || 0;
        }
        ctx?.bind(this);
    }

    public d(deep: number) {
        /* istanbul ignore else */
        if (this.deep < deep && this.r && this.handler) {
            this.r.off(this.handler);
        }
    }

    protected abstract reset(v: T): void;
}

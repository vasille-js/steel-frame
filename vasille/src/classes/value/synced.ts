import { Reactive } from "../core/core.js";
import { IValue, WritableIValue } from "../core/ivalue.js";

export abstract class SyncedIValue<T, Extra extends unknown> extends IValue<T, Extra> {
    public override readonly id: number | undefined;
    protected sync: WritableIValue<T, Extra>;

    protected constructor(sync: WritableIValue<T, Extra>, ctx: Reactive) {
        super(ctx.sDeep);
        this.sync = sync;
        this.id = sync.id;
    }

    public on(handler: (value: T, extra?: Extra) => void): void {
        this.sync.on(handler);
    }

    public off(handler: (value: T, extra?: Extra) => void): void {
        this.sync.off(handler);
    }
}

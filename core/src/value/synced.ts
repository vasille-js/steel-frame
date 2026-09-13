import { Reactive } from "../core/core.js";
import { IValue } from "../core/ivalue.js";

export abstract class SyncedIValue<T, Extra extends unknown> extends IValue<T, Extra> {
    protected sync: IValue<T, Extra>;

    protected constructor(sync: IValue<T, Extra>, ctx?: Reactive) {
        super(ctx?.sDeep ?? 0);
        this.sync = sync;
    }

    public on(handler: (value: T, extra?: Extra) => void): void {
        this.sync.on(handler);
    }

    public off(handler: (value: T, extra?: Extra) => void): void {
        this.sync.off(handler);
    }
}

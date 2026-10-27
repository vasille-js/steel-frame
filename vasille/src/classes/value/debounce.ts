import { Reactive } from "../core/core.js";
import { Destroyable } from "../core/destroyable.js";
import { ReadableIValue, WritableIValue } from "../core/ivalue.js";
import { SyncedIValue } from "./synced.js";

export class DebounceReference<T, Extra extends unknown> extends SyncedIValue<T, Extra> implements Destroyable {
    protected readonly target: ReadableIValue<T, Extra>;
    protected readonly handler: (v: T) => void;
    protected timer: ReturnType<typeof setTimeout> | undefined;

    public constructor(
        createRef: (v: T, ctx?: Reactive) => WritableIValue<T, Extra>,
        target: ReadableIValue<T, Extra>,
        delay: number,
        ctx: Reactive,
    ) {
        super(createRef(target.V, ctx), ctx);

        target.on(
            (this.handler = (v: T, extra?: Extra) => {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.sync.up(v, extra);
                }, delay);
            }),
        );
        this.target = target;

        this.rDeep = target.sDeep;
        if (ctx.sDeep > target.sDeep) {
            ctx.bind(this);
        }
    }

    public get V(): T {
        return this.sync.V;
    }

    public destroy(): void {
        clearTimeout(this.timer);
        this.target.off(this.handler);
    }
}

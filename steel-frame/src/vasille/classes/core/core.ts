import { safe } from "../functional/safety.js";
import { Destroyable } from "./destroyable.js";

/**
 * A reactive object
 * @class Reactive
 * @extends Destroyable
 */
export class Reactive implements Destroyable {
    public readonly pos: number;
    public deep: number;

    /** use it for debugging */
    declare public id: number | undefined;

    /** cache abort signal */
    declare public abortSignal: AbortSignal | undefined;

    public constructor(deep: number) {
        this.pos = this.deep = deep;
    }
    /**
     * A list of user-defined bindings
     */
    private linked?: Destroyable[];
    private onDestroy?: () => void;

    public bind<T extends Destroyable & { deep: number }>(value: T): void {
        if (this.linked) {
            this.linked.push(value);
        } else {
            this.linked = [value];
        }
        if (this.deep > value.deep) {
            this.refreshDeep(value.deep);
        }
    }

    public refreshDeep(deep: number) {
        this.deep = deep;
    }

    public runOnDestroy(func: () => void) {
        const existing = this.onDestroy;

        if (existing) {
            this.onDestroy = () => {
                existing();
                safe(func)();
            };
        } else {
            this.onDestroy = safe(func);
        }
        // this component needs manual destruction
        this.refreshDeep(0);
    }

    public destroy(deep: number) {
        this.onDestroy?.();
        if (this.deep < deep) {
            this.linked?.forEach(item => {
                item.destroy(deep);
            });
        }
    }
}

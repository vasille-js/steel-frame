import { IValue, Reactive } from "../classes/index.js";
import { ref } from "./internal.js";

export function awaited<T>(
    target: ((signal: AbortSignal) => Promise<T>) | IValue<(signal: AbortSignal) => Promise<T>, unknown>,
    ctx: Reactive,
    createRef = ref,
): [IValue<unknown, unknown>, IValue<unknown, unknown>, () => void] {
    const err = createRef<unknown>(undefined);
    const value = createRef<unknown>(undefined);
    let controller: AbortController | undefined;
    let lastResultKey = 0;

    function run() {
        let resultKey = ++lastResultKey;

        controller?.abort();
        controller = new AbortController();

        const fn = target instanceof IValue ? target.V : target;
        let current: Promise<T> | undefined;

        err.V = undefined;
        value.V = undefined;

        try {
            current = fn(controller.signal);
        } catch (e) {
            current = undefined;
            err.V = e;
        }

        if (current instanceof Promise) {
            current
                .then(result => {
                    if (resultKey === lastResultKey) {
                        value.V = result;
                    }
                })
                .catch(e => {
                    if (resultKey === lastResultKey) {
                        err.V = e;
                    }
                })
                .finally(() => {
                    if (resultKey === lastResultKey) {
                        controller?.abort();
                        controller = undefined;
                    }
                });
        } else {
            value.V = current;
            controller = undefined;
        }
    }

    if (target instanceof IValue) {
        target.on(run);
    }
    ctx.runOnDestroy(() => {
        if (target instanceof IValue) {
            target.off(run);
        }
        controller?.abort();
    });

    run();

    return [err, value, run];
}

export function abortSignal(ctx: Reactive): AbortSignal {
    if (ctx.abortSignal) {
        return ctx.abortSignal;
    }

    const manager = new AbortController();

    ctx.runOnDestroy(() => {
        manager.abort();
    });

    return (ctx.abortSignal = manager.signal);
}

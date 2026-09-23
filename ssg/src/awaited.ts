import { ref } from "vasille-jsx";
import { IValue } from "vasille";

const promises: Promise<unknown>[] = [];

export function awaited<T>(target: () => Promise<T>): [IValue<unknown, unknown>, IValue<unknown, unknown>, () => void] {
    const value = ref<unknown>(undefined);
    const err = ref<unknown>(undefined);
    let current: Promise<T> | undefined;

    try {
        current = target();
    } catch (e) {
        current = undefined;
        err.V = e;
    }

    if (current instanceof Promise) {
        promises.push(current.then(result => (value.V = result)).catch(e => (err.V = e)));
    } else {
        value.V = current;
    }

    return [err, value, () => void 0];
}

export async function waitForAsyncData() {
    await Promise.all(promises);
}

import { IValue, KindOfIValue, Reactive } from "vasille";
import {
    DevArrayModel,
    DevDebounceReference,
    DevDeepFieldReference,
    DevEdgeReference,
    DevExpression,
    DevMapModel,
    DevReference,
    DevSetModel,
    DevSingleFieldReference,
    errorToString,
    executionPosition,
    ExecutionPosition,
    inspector,
    StaticPosition,
} from "vasille/dev";
import { match, set } from "../internal.js";

export function devExpr<T, Args extends unknown[]>(
    ctx: Reactive,
    func: (...args: Args) => T,
    values: KindOfIValue<Args, ExecutionPosition>,
    depsCode: string[],
    declaration: StaticPosition,
    name?: string,
): DevExpression<T, Args> {
    return new DevExpression<T, Args>(func, values, ctx, name, depsCode, declaration, false, false);
}

export function devSafeExpr<T, Args extends unknown[]>(
    ctx: Reactive,
    func: (...args: Args) => T,
    values: KindOfIValue<Args, ExecutionPosition>,
    depsCode: string[],
    declaration: StaticPosition,
    name?: string,
): DevExpression<T, Args> {
    return new DevExpression<T, Args>(func, values, ctx, name, depsCode, declaration, false, true);
}

export function devRef<T>(
    v: T,
    ctx: Reactive | undefined,
    declaration: StaticPosition,
    name?: string,
): IValue<T, ExecutionPosition> {
    return new DevReference(v, ctx, declaration, name);
}

export function devSafeRef<T>(
    fn: () => T,
    ctx: Reactive | undefined,
    declaration: StaticPosition,
    name?: string,
): IValue<T | undefined, ExecutionPosition> {
    const ref = new DevReference<T | undefined>(undefined, ctx, declaration, name);

    try {
        ref.V = fn();
    } catch (e) {
        inspector.reportReferenceError({
            time: Date.now(),
            position: executionPosition(declaration, new Error()),
            error: errorToString(e),
            id: ref.id,
        });
    }

    return ref;
}

export function devSetModel(usage: StaticPosition, ctx: Reactive | undefined, data?: unknown[], name?: string) {
    return new DevSetModel(usage, data, ctx, name);
}

export function devMapModel(
    usage: StaticPosition,
    ctx: Reactive | undefined,
    data?: [unknown, unknown][],
    name?: string,
) {
    return new DevMapModel(usage, data, ctx, name);
}

export function devArrayModel(
    usage: StaticPosition,
    ctx: Reactive | undefined,
    data?: unknown[] | number,
    name?: string,
) {
    return new DevArrayModel(usage, data, ctx, name);
}

export function devEnsure<T extends object>(
    obj: T | null | undefined,
    key: keyof T,
    ctx: Reactive | undefined,
    declaration: StaticPosition,
) {
    if (!obj) {
        return undefined;
    }

    return key in obj ? obj[key] : (obj[key] = devRef(undefined, ctx, declaration) as unknown as T[keyof T]);
}

export function devMatch(name: string | number | symbol, data: unknown, declaration: StaticPosition, ctx?: Reactive) {
    return match(ctx, name, data, v => devRef(v, ctx, declaration));
}

export function devSet(
    o: object,
    key: string | symbol | number,
    value: unknown,
    ctx: Reactive | undefined,
    declaration: StaticPosition,
    executionPosition: ExecutionPosition,
) {
    if (o[key] instanceof IValue) {
        o[key].up(value, executionPosition);
        return value;
    }

    return set(ctx, o, key, value, v => devRef(v, ctx, declaration));
}

function createRef<T>(declaration: StaticPosition, name?: string): (value: T, ctx?: Reactive) => DevReference<T> {
    return (value, ctx) => new DevReference(value, ctx, declaration, name);
}

export function devEdgeRef<T>(
    ctx: Reactive | undefined,
    getter: () => T,
    setter: (v: T) => void,
    subscriber: ((setter: (v: T) => void) => void | (() => void)) | undefined,
    declaration: StaticPosition,
    name?: string,
) {
    return new DevEdgeReference(createRef<T>(declaration, name), getter, setter, ctx, subscriber);
}

export function devDebounceRef<T>(
    ctx: Reactive,
    target: IValue<T, ExecutionPosition>,
    delay: number,
    declaration: StaticPosition,
    name?: string,
) {
    return new DevDebounceReference(createRef<T>(declaration, name), target, delay, ctx);
}

export function toDevFieldRef(
    ctx: Reactive,
    o: IValue<object | undefined | null, ExecutionPosition>,
    key: string | symbol,
    declaration: StaticPosition,
    name?: string,
) {
    return new DevSingleFieldReference(createRef(declaration, name), o, key, ctx);
}

export function toDevDeepFieldRef(
    ctx: Reactive,
    o: IValue<object | undefined | null, ExecutionPosition>,
    key: (string | symbol)[],
    declaration: StaticPosition,
    name?: string,
) {
    return new DevDeepFieldReference(createRef(declaration, name), o, key, ctx);
}

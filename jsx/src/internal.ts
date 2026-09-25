import {
    IValue,
    Reactive,
    KindOfIValue,
    Expression,
    Reference,
    SetModel,
    MapModel,
    ArrayModel,
    safe,
    EdgeReference,
    DebounceReference,
    SingleFieldReference,
    DeepFieldReference,
    reportError,
} from "vasille";

export function expr<T, Args extends unknown[]>(
    ctx: Reactive,
    func: (...args: Args) => T,
    values: KindOfIValue<Args, unknown>,
): Expression<T, Args, unknown> {
    return new Expression<T, Args, unknown>(func, args => ref(func.apply(null, args)), values, ctx);
}

export function safeExpr<T, Args extends unknown[]>(
    ctx: Reactive,
    func: (...args: Args) => T,
    values: KindOfIValue<Args, unknown>,
): Expression<T, Args, unknown> {
    return new Expression<T, Args, unknown>(func, args => ref(safe(func).apply(null, args)), values, ctx);
}

/**
 * It transforms a non-reactive value to a reactive one.
 * 1. `let a = 0` to `const a = ref(0)`
 */
export function ref<T>(v: T, ctx?: Reactive): IValue<T, unknown> {
    return new Reference(v, ctx);
}

/**
 * It transforms a non-reactive value to a reactive one.
 * 1. `let a = x.y` to `const a = safeRef(() => x.y)`
 */
export function safeRef<T>(fn: () => T, ctx?: Reactive): IValue<T | undefined, unknown> {
    return new Reference(safe(fn)() as T | undefined, ctx);
}

/**
 * create a `Set` model
 * 1. translate `setModel(#)` to `setModel(ctx, #)`
 */
export function setModel(ctx: Reactive | undefined, data?: unknown[]) {
    return new SetModel(data, ctx);
}

/**
 * create a `Map` model
 * 1. `mapModel(#)` to `mapModel(ctx, #)`
 */
export function mapModel(ctx: Reactive | undefined, data?: [unknown, unknown][]) {
    return new MapModel(data, ctx);
}

/**
 * create an `Array` model
 * 1. `arrayModel([...])` to `arrayModel(ctx, [...])`
 */
export function arrayModel(ctx: Reactive | undefined, data?: unknown[] | number) {
    return new ArrayModel(data, ctx);
}

/**
 * Use when a value must be IValue but can be undefined
 * 1. `let $a = obj.$key` to `const $a = ensure(ctx, obj, "$key")`
 */
export function ensure<T extends object>(ctx: Reactive | undefined, obj: T | null | undefined, key: keyof T) {
    return !obj
        ? ref(undefined, ctx)
        : key in obj
          ? obj[key]
          : (obj[key] = ref(undefined, ctx) as unknown as T[keyof T]);
}

/**
 * Used for destruction with computed values
 * 1. `{[a]: a1} = {x: 2}` to `{[a]: a1 = match("a1")} = {x: 2}`
 * 1. `{[a]: a1 = 3} = {x: 2}` to `{[a]: a1 = match("a1", 3)} = {x: 2}`
 */
export function match(ctx: Reactive | undefined, name: string | number | symbol, data?: unknown, createRef = ref) {
    const iValueRequired = typeof name === "string" && name.startsWith("$");
    const isIValue = data instanceof IValue;

    if (iValueRequired && !isIValue) {
        return createRef(data, ctx);
    }
    if (!iValueRequired && isIValue) {
        return data.V;
    }

    return data;
}

/**
 * Set a value of a field (alternative to proxies)
 * 1. `obj.$key = 23` to `set(obj, "$key", 23)`
 * 2. `arr[0] = 23` to `set(arr, 0, 23)`
 */
export function set(
    ctx: Reactive | undefined,
    o: object,
    key: string | symbol | number,
    value: unknown,
    createRef = ref,
) {
    if (o[key] instanceof IValue) {
        o[key].V = value;
    } else if (o instanceof ArrayModel && typeof key === "number") {
        o.replace(key, value);
    } else if (typeof key === "string" && key.startsWith("$")) {
        o[key] = createRef(value, ctx);
    } else {
        o[key] = value;
    }
    return value;
}

/**
 * It safely initializes a child component.
 * 1. `<Child x={y.z}/>` to `safeInit(() => Child({x: y.z}))`
 */
export function safeInit<T>(fn: () => T): T | undefined {
    try {
        return fn();
    } catch (e) {
        reportError(e);
    }
}

/**
 * Debounce update signals emitted by an IValue.
 * 1. `const $b = debounceRef($a, 1000)` to `const $b = debounceRef(ctx, $a, 1000)`
 */
export function debounceRef<T>(ctx: Reactive, target: IValue<T, unknown>, delay: number, createRef = ref) {
    return new DebounceReference(createRef, target, delay, ctx);
}

/**
 * Create a reference to a field of an object. Updating the reference will update the object.
 * 1. `const $a = toRef($obj.a)` to `const $a = toFieldRef(ctx, $obj, "a")`
 */
export function toFieldRef(
    ctx: Reactive,
    o: IValue<object | undefined | null, unknown>,
    key: string | symbol,
    createRef = ref,
) {
    return new SingleFieldReference(createRef, o, key, ctx);
}

/**
 * Create a reference to a deep field of an object. Updating the reference will update the object.
 * 1. `const $a = toRef($obj.a.b)` to `const $a = toDeepFieldRef(ctx, $obj, ["a", "b])`
 */
export function toDeepFieldRef(
    ctx: Reactive,
    o: IValue<object | undefined | null, unknown>,
    key: (string | symbol)[],
    createRef = ref,
) {
    return new DeepFieldReference(createRef, o, key, ctx);
}

export interface ReadableIValue<T, Extra> {
    get id(): number | undefined;
    get sDeep(): number;
    get rDeep(): number;
    get V(): T;
    on(handler: (value: T, extra?: Extra) => void): void;
    off(handler: (value: T, extra?: Extra) => void): void;
}

export interface WritableIValue<T, Extra> extends ReadableIValue<T, Extra> {
    get V(): T;
    set V(value: T);
    up(value: T, arg?: Extra): T;
}

/**
 * Interface which describes a value
 * @class IValue
 */
export abstract class IValue<T, Extra extends unknown> implements ReadableIValue<T, Extra> {
    /**
     * Get the encapsulated value
     * @return {*} the encapsulated value
     */
    public abstract get V(): T;

    /**
     * Add a new handler to value change
     * @param handler {function(value : *)} the handler to add
     */
    public abstract on(handler: (value: T, extra?: Extra) => void): void;

    /**
     * Removes a handler of value change
     * @param handler {function(value : *)} the handler to remove
     */
    public abstract off(handler: (value: T, extra?: Extra) => void): void;

    /** use it for debugging */
    declare public id: number | undefined;

    /** self dependency deep */
    public readonly sDeep: number;
    /** reactive dependency deep */
    public rDeep: number;

    public constructor(deep: number) {
        this.sDeep = this.rDeep = deep;
    }

    public toJSON(): T {
        return this.V;
    }

    public toString(): string {
        return this.V?.toString() ?? "iValue<void>";
    }
}

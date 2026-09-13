/**
 * Interface which describes a value
 * @class IValue
 */
export abstract class IValue<T, Extra extends unknown> {
    /**
     * Get the encapsulated value
     * @return {*} the encapsulated value
     */
    public abstract get V(): T;

    /**
     * Sets the encapsulated value
     * @param value {*} value to encapsulate
     */
    public abstract set V(value: T);

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

    /**
     * Updates the value
     * @param value {*} the new value
     * @param arg {*} extra argument
     */
    public abstract up(value: T, arg?: Extra): T;

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

/** Encapsulate an array for more comfortable editing */
export declare class ArrayModel<T> {
    private constructor();
    /** Give read access to the encapsulated array */
    public get array(): readonly T[];
    /** Pop the last item of the array */
    public pop(): T | undefined;
    /** Append items to the end of the array */
    public push(...items: Array<T>): number;
    /** Shift the first item of the array */
    public shift(): T | undefined;
    /** Sort items inside the array */
    public sort(compareFn?: (a: T, b: T) => number): this;
    /** Splice calls `Array.splice` */
    public splice(start: number, deleteCount?: number, ...items: T[]): T[];
    /** Prepend items to the array */
    public unshift(...items: T[]): number;
    /** Replace an item of the array */
    public replace(at: number, with_: T): this;
}

/** Encapsulate an array for more comfortable editing */
export declare class SetModel<T> {
    private constructor();
    /** Give read access to the encapsulated data */
    public get set(): ReadonlySet<T>;
    /** Add a new value to the set */
    public add(value: T): this;
    /** Clear the set */
    public clear(): void;
    /** Delete a value from the set, return true if the value was deleted */
    public delete(value: T): boolean;
}

/** Encapsulate an array for more comfortable editing */
export declare class MapModel<K, T> {
    private constructor();
    /** Give read access to the encapsulated data */
    public get map(): ReadonlyMap<K, T>;
    /** Clear the map */
    public clear(): void;
    /** Delete a value from the map, return true if the value was deleted */
    public delete(key: K): boolean;
    /** Set a new value to the map at a given key */
    public set(key: K, value: T): this;
}

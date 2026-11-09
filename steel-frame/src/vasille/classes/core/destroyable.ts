/**
 * Mark an object which can be destroyed
 * @interface Destroyable
 */
export interface Destroyable {
    /**
     * Garbage collector method
     */
    d(deep: number): void;
}

import { Destroyable, IValue } from "../../../../vasille/index.js";

/**
 * Describe a common binding logic
 * @class Binding
 */
export class Binding<T> implements Destroyable {
    public readonly deep: number;
    private binding: IValue<T, unknown>;
    private func!: (value: T) => void;

    /**
     * Constructs a common binding logic
     * @param value {IValue} the value to bind
     */
    public constructor(value: IValue<T, unknown>) {
        this.binding = value;
        this.deep = value.deep;
    }

    protected init(bounded: (v: T) => void) {
        this.func = bounded;
        this.binding.on(this.func);
        this.func(this.binding.V);
    }

    /**
     * Just clear bindings
     */
    public destroy(deep: number) {
        /* istanbul ignore else */
        if (this.binding.deep < deep) {
            this.binding.off(this.func);
        }
    }
}

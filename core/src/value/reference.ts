import { Reactive } from "../core/core.js";
import { IValue } from "../core/ivalue.js";
import { reportError } from "../functional/safety.js";

/**
 * Declares a notifiable value
 * @class Reference
 * @extends IValue
 */
export class Reference<T, Extra extends unknown> extends IValue<T, Extra> {
    /**
     * The encapsulated value
     * @type {*}
     */
    protected state: T;

    protected handler1?: (value: T, extra?: Extra) => void;
    protected handler2?: (value: T, extra?: Extra) => void;

    /**
     * Array of handlers
     * @type {Set}
     * @readonly
     */
    protected onChange?: Set<(value: T, extra?: Extra) => void>;

    /**
     * @param value {any} the initial value
     * @param ctx {Reactive} the reactive context
     */
    public constructor(value: T, ctx?: Reactive) {
        super(ctx?.sDeep ?? 0);
        this.state = value;
    }

    public get V(): T {
        return this.state;
    }

    public set V(value: T) {
        this.up(value);
    }

    public up(value: T, extra?: Extra): T {
        if (this.state !== value) {
            const { onChange, handler1, handler2 } = this;

            this.state = value;

            if (onChange) {
                onChange.forEach(handler => {
                    this.run(handler, value, extra);
                });
            } else if (handler1) {
                this.run(handler1, value, extra);

                if (handler2) {
                    this.run(handler2, value, extra);
                }
            }
        }

        return value;
    }

    public on(handler: (value: T, extra?: Extra) => void): void {
        if (this.onChange) {
            this.onChange.add(handler);
        } else {
            if (!this.handler1) {
                this.handler1 = handler;
            } else if (!this.handler2) {
                this.handler2 = handler;
            } else {
                this.onChange = new Set([this.handler1, this.handler2, handler]);
                this.handler1 = undefined;
                this.handler2 = undefined;
            }
        }
    }

    public off(handler: (value: T, arg?: Extra) => void): void {
        if (this.onChange) {
            this.onChange.delete(handler);
        } else {
            if (this.handler1 === handler) {
                this.handler1 = this.handler2;
                this.handler2 = undefined;
            } else if (this.handler2 === handler) {
                this.handler2 = undefined;
            }
        }
    }

    protected run(fn: (value: T, extra?: Extra) => void, value: T, extra?: Extra) {
        try {
            fn(value, extra);
        } catch (e) {
            reportError(e);
        }
    }
}

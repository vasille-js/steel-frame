import { Reactive } from "../core/core.js";
import { Destroyable } from "../core/destroyable.js";
import { IValue } from "../core/ivalue.js";
import { SyncedIValue } from "./synced.js";

export class FieldReference<Extra extends unknown> extends SyncedIValue<unknown, Extra> implements Destroyable {
    protected readonly object: IValue<object | undefined | null, Extra>;
    protected readonly updated: (v: unknown) => object;
    protected readonly handler: (v: object | undefined | null) => void;
    protected readonly deps: IValue<unknown, Extra>[];
    protected readonly depsHandler: (() => void) | undefined;

    public constructor(
        createRef: (v: unknown, ctx?: Reactive) => IValue<unknown, Extra>,
        object: IValue<object | undefined | null, Extra>,
        getValue: (v: object | undefined | null) => unknown,
        update: (v: unknown) => object,
        ctx: Reactive,
        deps: IValue<unknown, Extra>[],
    ) {
        super(createRef(getValue(object.V), ctx), ctx);

        object.on(
            (this.handler = (v: object | undefined | null, extra?: Extra) => {
                this.sync.up(getValue(v), extra);
            }),
        );

        this.object = object;
        this.updated = update;
        this.rDeep = object.sDeep;
        this.deps = deps;

        if (ctx.sDeep > object.sDeep) {
            ctx.bind(this);
        }

        if (deps.length) {
            const handler = (this.depsHandler = () => {
                this.handler(object.V);
            });

            for (const dep of deps) {
                dep.on(handler);
            }
        }
    }

    public get V(): unknown {
        return this.sync.V;
    }
    public set V(value: unknown) {
        this.object.V = this.updated(value);
    }

    public up(value: unknown, extra?: Extra): unknown {
        return this.object.up(this.updated(value), extra);
    }

    public destroy(): void {
        this.object.off(this.handler);

        if (this.depsHandler) {
            for (const dep of this.deps) {
                dep.off(this.depsHandler);
            }
        }
    }
}

function unwrap<T>(value: T | IValue<T, unknown>): T {
    return value instanceof IValue ? value.V : value;
}

export class SingleFieldReference<Extra extends unknown> extends FieldReference<Extra> {
    public constructor(
        createRef: (v: unknown, ctx?: Reactive) => IValue<unknown, Extra>,
        object: IValue<object | undefined | null, Extra>,
        field: number | string | symbol | IValue<number | string | symbol, Extra>,
        ctx: Reactive,
    ) {
        super(
            createRef,
            object,
            o => o?.[unwrap(field)],
            value => ({
                ...object.V,
                [unwrap(field)]: value,
            }),
            ctx,
            field instanceof IValue ? [field] : [],
        );
    }
}

export class DeepFieldReference<Extra extends unknown> extends FieldReference<Extra> {
    public constructor(
        createRef: (v: unknown, ctx?: Reactive) => IValue<unknown, Extra>,
        object: IValue<object | undefined | null, Extra>,
        fields: (number | string | symbol | IValue<number | string | symbol, Extra>)[],
        ctx: Reactive,
    ) {
        super(
            createRef,
            object,
            o => {
                let it: unknown = o;

                for (const field of fields) {
                    if (typeof it === "object" && it !== null) {
                        it = (unwrap(it) as Record<string | symbol, unknown>)[unwrap(field)];
                    } else {
                        return undefined;
                    }
                }
                return it;
            },
            value => {
                let it: unknown = object.V;
                const track: (Record<string | symbol, unknown> | undefined)[] = [
                    it as Record<string | symbol, unknown> | undefined,
                ];

                for (let i = 0; i < fields.length - 1; i++) {
                    if (typeof it === "object" && it !== null) {
                        it = (it as Record<string | symbol, unknown>)[unwrap(fields[i]!)];
                    } else {
                        it = {};
                    }
                    track.push(it as Record<string | symbol, unknown> | undefined);
                }
                for (let i = track.length - 1; i >= 0; i--) {
                    track[i] = { ...track[i], [unwrap(fields[i]!)]: i === track.length - 1 ? value : track[i + 1] };
                }
                return track[0] as object;
            },
            ctx,
            fields.filter(field => field instanceof IValue),
        );
    }
}

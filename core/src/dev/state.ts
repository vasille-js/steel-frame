import { Reactive } from "../core/core.js";
import { Destroyable } from "../core/destroyable.js";
import { IValue } from "../core/ivalue.js";
import { reportError } from "../functional/safety.js";
import { DebounceReference } from "../value/debounce.js";
import { Expression, KindOfIValue } from "../value/expression.js";
import { DeepFieldReference, SingleFieldReference } from "../value/field.js";
import { Reference } from "../value/reference.js";
import {
    Dependency,
    errorToString,
    ExecutionPosition,
    inspector,
    provideId,
    StaticPosition,
    toDevValue,
} from "./inspectable.js";

export abstract class BaseDevReference<T> extends Reference<T, ExecutionPosition> {
    protected override readonly onChange: Set<(value: T, position?: ExecutionPosition) => void>;

    public constructor(value: T, ctx?: Reactive) {
        super(value, ctx);
        this.onChange = new Set();
    }

    public override up(value: T, position?: ExecutionPosition): T {
        if (this.state !== value) {
            this.shareUpdate(position);
        }
        return super.up(value, position);
    }

    protected override run(fn: (value: T, extra?: ExecutionPosition) => void, value: T, position?: ExecutionPosition) {
        try {
            fn(value, position);
        } catch (e) {
            this.shareError(e, position);
            reportError(e);
        }
    }

    protected abstract shareUpdate(position?: ExecutionPosition): void;
    protected abstract shareError(error: unknown, position?: ExecutionPosition): void;
}

export class DevReference<T> extends BaseDevReference<T> implements Destroyable {
    public override readonly id: number;

    public constructor(value: T, ctx: Reactive | undefined, declaration: StaticPosition, name?: string) {
        super(value, ctx);

        this.id = provideId();
        this.rDeep = ctx?.sDeep ?? 0;
        inspector.newReference({
            id: this.id,
            declaration: declaration,
            value: toDevValue(this.state),
            time: Date.now(),
        });
        if (ctx?.id && name) {
            inspector.addContextState({
                id: ctx.id,
                name: name,
                stateId: this.id,
            });
        }
        if (ctx) {
            ctx.bind(this);
        }
    }

    public destroy(): void {
        inspector.destroy({ id: this.id, time: Date.now() });
    }

    protected shareUpdate(position?: ExecutionPosition) {
        inspector.updateReference({
            id: this.id,
            time: Date.now(),
            position: position,
            value: toDevValue(this.state),
        });
    }

    protected shareError(error: unknown, position?: ExecutionPosition) {
        inspector.reportReferenceError({
            id: this.id,
            time: Date.now(),
            error: errorToString(error),
            position: position,
        });
    }
}

export class ExpressionDevReference<T> extends BaseDevReference<T> {
    public override readonly id: number;

    public constructor(id: number, value: T) {
        super(value);

        this.id = id;
    }

    protected override shareError(error: unknown, position: ExecutionPosition) {
        inspector.reportReferenceError({
            id: this.id,
            time: Date.now(),
            error: errorToString(error),
            position: position,
        });
    }

    protected override shareUpdate() {
        // do nothing
    }
}

export class DevExpression<T, Args extends unknown[]> extends Expression<T, Args, ExecutionPosition> {
    declare public readonly id: number;
    public readonly isWatch: boolean;

    public constructor(
        func: (...args: Args) => T,
        values: KindOfIValue<Args, ExecutionPosition>,
        ctx: Reactive,
        name: string | undefined,
        depsCode: string[],
        declaration: StaticPosition,
        isWatch: boolean,
        safe: boolean,
    ) {
        const id = provideId();

        super(
            func,
            (args: Args) => {
                let initialValue: T | undefined;

                try {
                    initialValue = func.apply(null, args);
                } catch (e) {
                    inspector.reportExpressionCalculationError({
                        id: id,
                        time: Date.now(),
                        error: errorToString(e),
                        deps: args.map(toDevValue),
                    });
                    if (!safe) {
                        throw e;
                    }
                }

                return new ExpressionDevReference<T>(id, initialValue as T);
            },
            values,
            ctx,
        );

        if (ctx.sDeep <= ctx.rDeep) {
            ctx.bind(this);
        }
        this.isWatch = isWatch;

        inspector.newExpression({
            id: this.id,
            declaration: declaration,
            isWatch: isWatch,
            value: toDevValue(this.sync.V),
            deps: values.map((dep, index) => {
                if (dep instanceof IValue) {
                    return {
                        code: depsCode[index]!,
                        id: dep.id!,
                        value: toDevValue(dep.V),
                    } satisfies Dependency;
                }

                return depsCode[index]!;
            }),
            time: Date.now(),
        });
        if (ctx?.id && name) {
            inspector.addContextState({
                id: ctx.id,
                name: name,
                stateId: id,
            });
        }
    }

    public override destroy(): void {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy();
    }

    protected override getHandler(
        func: (...args: Args) => T,
    ): (i: number | undefined, _value: unknown, extra?: ExecutionPosition) => void {
        return (i: number, value: unknown, position: ExecutionPosition) => {
            try {
                this.valuesCache[i] = value;

                const newValue = func.apply(this, this.valuesCache);

                if (this.sync.V !== newValue || this.isWatch) {
                    this.sync.up(newValue, position);
                    inspector.updateExpression({
                        id: this.id,
                        time: Date.now(),
                        position: position,
                        value: newValue,
                        deps: this.valuesCache.map(toDevValue),
                    });
                }
            } catch (e) {
                inspector.reportExpressionCalculationError({
                    id: this.id,
                    time: Date.now(),
                    error: errorToString(e),
                    position: position,
                    deps: this.valuesCache.map(toDevValue),
                });
                reportError(e);
            }
        };
    }
}

export class DevDebounceReference<T> extends DebounceReference<T, ExecutionPosition> {
    declare protected readonly sync: DevReference<T>;

    public constructor(
        createRef: (v: T, ctx?: Reactive) => DevReference<T>,
        target: IValue<T, ExecutionPosition>,
        delay: number,
        ctx: Reactive,
    ) {
        super(createRef, target, delay, ctx);
        ctx.bind(this.sync);
    }
}

export class DevSingleFieldReference extends SingleFieldReference<ExecutionPosition> {
    declare protected readonly sync: DevReference<unknown>;

    public constructor(
        createRef: (v: unknown, ctx?: Reactive) => DevReference<unknown>,
        object: IValue<object | undefined | null, ExecutionPosition>,
        field: string | symbol,
        ctx: Reactive,
    ) {
        super(createRef, object, field, ctx);
        ctx.bind(this.sync);
    }
}

export class DevDeepFieldReference extends DeepFieldReference<ExecutionPosition> {
    declare protected readonly sync: DevReference<unknown>;

    public constructor(
        createRef: (v: unknown, ctx?: Reactive) => DevReference<unknown>,
        object: IValue<object | undefined | null, ExecutionPosition>,
        fields: (string | symbol)[],
        ctx: Reactive,
    ) {
        super(createRef, object, fields, ctx);
        ctx.bind(this.sync);
    }
}

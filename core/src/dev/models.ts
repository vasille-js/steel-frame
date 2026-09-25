import { Reactive } from "../core/core.js";
import { Destroyable } from "../core/destroyable.js";
import { ArrayModel } from "../models/array-model.js";
import { MapModel } from "../models/map-model.js";
import { SetModel } from "../models/set-model.js";
import { inspector, provideId, StaticPosition, toDevValue } from "./inspectable.js";

let updateId = 0;

function shareModelUpdate(modelId: number, method: string, args: unknown[], result: unknown) {
    const id = ++updateId;

    inspector.updateModel({
        id: id,
        modelId: this.id,
        method: method,
        return: toDevValue(result),
        time: Date.now(),
    });
    args.forEach((arg, index) => {
        inspector.updateModelArg({
            id: id,
            value: toDevValue(arg),
        });
    });
}

export class DevArrayModel<T> extends ArrayModel<T> implements Destroyable {
    public readonly id: number;

    public constructor(usage: StaticPosition, data?: Array<T> | number, ctx?: Reactive, name?: string) {
        super(data, ctx);

        this.id = provideId();

        ctx?.bind(this);
        inspector.createModel({
            id: this.id,
            type: "array",
            usage: usage,
            time: Date.now(),
        });
        this.forEach((item, index) => {
            inspector.createModelItem({
                model: this.id,
                key: toDevValue(index),
                value: toDevValue(item),
            });
        });
        if (ctx?.id && name) {
            inspector.addContextState({
                id: ctx.id,
                name: name,
                stateId: this.id,
            });
        }
    }

    public destroy(): void {
        inspector.destroy({ id: this.id, time: Date.now() });
    }

    public override fill(value: T, start?: number, end?: number): this {
        shareModelUpdate(this.id, "fill", [value, start, end], undefined);
        return super.fill(value, start, end);
    }

    public override pop(): T | undefined {
        const result = super.pop();
        shareModelUpdate(this.id, "pop", [], result);
        return result;
    }

    public override push(...items: T[]): number {
        const result = super.push(...items);
        shareModelUpdate(this.id, "push", items, result);
        return result;
    }

    public override shift(): T | undefined {
        const result = super.shift();
        shareModelUpdate(this.id, "shift", [], result);
        return result;
    }

    public override splice(start: number, deleteCount?: number, ...items: T[]): T[] {
        shareModelUpdate(this.id, "splice", [start, deleteCount, ...items], undefined);
        return super.splice(start, deleteCount, ...items);
    }

    public override unshift(...items: T[]): number {
        const result = super.unshift(...items);
        shareModelUpdate(this.id, "unshift", items, result);
        return result;
    }
}

export class DevSetModel<T> extends SetModel<T> implements Destroyable {
    public readonly id: number;

    public constructor(usage: StaticPosition, set?: T[], ctx?: Reactive, name?: string) {
        super(set, ctx);
        this.id = provideId();

        ctx?.bind(this);
        inspector.createModel({
            id: this.id,
            type: "set",
            usage: usage,
            time: Date.now(),
        });
        for (const item of this) {
            inspector.createModelItem({
                model: this.id,
                value: toDevValue(item),
            });
        }
        if (ctx?.id && name) {
            inspector.addContextState({
                id: ctx.id,
                name: name,
                stateId: this.id,
            });
        }
    }

    public destroy(): void {
        inspector.destroy({ id: this.id, time: Date.now() });
    }

    public override add(value: T): this {
        shareModelUpdate(this.id, "add", [value], undefined);
        return super.add(value);
    }

    public override clear(): void {
        shareModelUpdate(this.id, "clear", [], undefined);
        return super.clear();
    }

    public override delete(value: T): boolean {
        const result = super.delete(value);
        shareModelUpdate(this.id, "delete", [value], result);
        return result;
    }
}

export class DevMapModel<K, T> extends MapModel<K, T> implements Destroyable {
    public readonly id: number;

    public constructor(usage: StaticPosition, map?: [K, T][], ctx?: Reactive, name?: string) {
        super(map, ctx);
        this.id = provideId();

        ctx?.bind(this);
        inspector.createModel({
            id: this.id,
            type: "map",
            usage: usage,
            time: Date.now(),
        });
        for (const [key, value] of this.entries()) {
            inspector.createModelItem({
                model: this.id,
                key: toDevValue(key),
                value: toDevValue(value),
            });
        }
        if (ctx?.id && name) {
            inspector.addContextState({
                id: ctx.id,
                name: name,
                stateId: this.id,
            });
        }
    }

    public destroy(): void {
        inspector.destroy({ id: this.id, time: Date.now() });
    }

    public override clear(): void {
        shareModelUpdate(this.id, "clear", [], undefined);
        super.clear();
    }

    public override delete(key: K): boolean {
        const result = super.delete(key);
        shareModelUpdate(this.id, "delete", [key], result);
        return result;
    }

    public override set(key: K, value: T): this {
        shareModelUpdate(this.id, "set", [key, value], undefined);
        return super.set(key, value);
    }
}

import { IValue } from "../core/ivalue.js";
import { DevArrayModel, DevMapModel, DevSetModel } from "./models.js";

export type StaticPosition = [string, number, number, number, number];
export type ExecutionPosition = number;

let positionId: number = 1;

export function executionPosition(pathLineAndChar: StaticPosition, error: Error): ExecutionPosition {
    const id = positionId++;

    inspector.registerExecutionPosition({
        id: id,
        position: pathLineAndChar,
        stack: error.stack ?? "",
    });

    return id;
}

export function errorToString(e: unknown) {
    return e instanceof Error
        ? `${e.name}:${e.message}\n${e.stack}`
        : `${e && typeof e === "object" ? e.constructor.name : typeof e}:${e}`;
}

export interface Inspectable {
    id: number;
}

export interface Timed {
    time: number;
}

export interface InspectableReactive {
    id: number;
}

export interface Dependency extends Inspectable {
    code: string;
    value: DevValue;
}

export interface ProtocolPosition extends Inspectable {
    declaration: StaticPosition;
}

export interface ProtocolReference extends ProtocolPosition, Timed {
    value: DevValue;
}

export interface ProtocolReferenceUpdate extends Inspectable, Timed {
    value: DevValue;
    position?: ExecutionPosition;
}

export interface ProtocolError extends Inspectable, Timed {
    error: string;
}

export interface ProtocolReferenceError extends ProtocolError {
    position?: ExecutionPosition;
}

export interface ProtocolExpression extends ProtocolReference {
    deps: (Dependency | string)[];
    isWatch: boolean;
}

export interface ProtocolExpressionUpdate extends ProtocolReferenceUpdate {
    deps: DevValue[];
}

export interface ProtocolExpressionError extends ProtocolReferenceError {
    deps: DevValue[];
}

export interface ProtocolDependency {
    dependant: number;
    dependency: number;
}

export interface ProtocolComponent extends Inspectable, Timed {
    name: string;
    declaration?: StaticPosition | null;
    usage?: StaticPosition | null;
}

export interface ProtocolComponentProperty extends Inspectable {
    name: string;
    value: number | DevValue;
}

export interface ProtocolState extends Inspectable {
    name: string;
    stateId: number;
}

export interface ProtocolParent {
    child: number;
    parent: number;
}

export interface ProtocolTag extends Inspectable, Timed {
    usage: StaticPosition | undefined;
    tagName: string;
}

export interface ProtocolTagAttr extends Inspectable {
    name: string;
    value: number | DevValue;
}

export interface ProtocolTagClass extends Inspectable {
    name: string;
    value: number | string;
    condition?: number | DevValue;
}

export interface ProtocolTagStyle extends Inspectable {
    name: string;
    value: number | DevValue;
}

export interface ProtocolTagEvent extends Inspectable {
    name: string;
    value: number | DevValue;
}

export interface ProtocolTagBind extends Inspectable {
    name: string;
    value: number | DevValue;
}

export interface ProtocolTagCallback extends Inspectable {
    value: number | DevValue;
}

export interface ProtocolTagOnDestroy extends Inspectable {
    value: number | DevValue;
}

export interface ProtocolNode extends Inspectable, Timed {
    text: number | DevValue;
    position: StaticPosition;
}

export interface ProtocolSlotError extends ProtocolError {
    usage: StaticPosition;
}

export interface ProtocolComposeTime extends Inspectable, Timed {}

export interface ProtocolModel extends Inspectable, Timed {
    type: "array" | "set" | "map";
    usage: StaticPosition;
}

export interface ProtocolModelItem {
    model: number;
    key?: DevValue;
    value: DevValue;
}

export interface ProtocolModelUpdate extends Inspectable, Timed {
    modelId: number;
    method: string;
    return: DevValue;
}

export interface ProtocolModelUpdateArg extends Inspectable {
    value: DevValue;
}

export interface ProtocolStore extends ProtocolPosition, Timed {
    name: string;
}

export interface ProtocolCustomModel extends ProtocolPosition, Timed {
    usage: StaticPosition;
    name: string;
}

export interface ProtocolCustomModelProperty extends Inspectable {
    key: string;
    value: number | DevValue;
}

export interface ProtocolRouterTargetResult extends Inspectable, Timed {
    url: string;
    path: string;
    hash: string;
    targetFound: boolean;
    params: object;
}

export interface ProtocolRouterTargetResultQueryArg extends Inspectable {
    name: string;
    value: string;
}

export interface ProtocolExecutionPosition extends Inspectable {
    position: StaticPosition;
    stack: string;
}

export interface ProtocolDevValue extends Inspectable {
    pos: StaticPosition;
}

export interface ProtocolRoute {
    path: string;
}

export interface ProtocolRouterStateChange extends Timed {
    name: string;
    value: string | null | undefined;
}

export interface ProtocolRouterActionCall extends Timed {
    name: string;
    path: string;
}

export interface ProtocolFunctionCall extends Inspectable, Timed {
    position: StaticPosition;
}

export interface ProtocolFunctionCallArg extends Inspectable {
    value: DevValue | number;
}

export interface ProtocolFunctionResult extends Inspectable, Timed {
    result: DevValue;
    async: boolean;
}

export interface ProtocolFunctionError extends ProtocolError {
    async: boolean;
}

export interface ProtocolEventTrigger extends Timed {
    target: number;
    eventName: string;
    position?: StaticPosition;
    result?: {
        value?: DevValue;
        error?: string;
    };
}

export interface ProtocolObject extends Inspectable, Timed {
    constructor: string;
    position?: StaticPosition;
}

export interface ProtocolObjectProperty extends Inspectable, Timed {
    name: string;
    value: DevValue;
}

export interface ProtocolObjectUpdate extends Inspectable, Timed {}

export interface ProtocolCssInjector extends Inspectable, Timed {
    className: string;
    position: StaticPosition;
}

export interface ProtocolCssRule extends Inspectable {
    success: boolean;
    rule: string | [number, string];
}

export interface DestroyData extends Inspectable {
    time: number;
}

export interface EraseData {
    position: StaticPosition;
}

export interface Inspector {
    registerExecutionPosition(pos: ProtocolExecutionPosition): void;
    reportError(err: ProtocolError): void;

    // Reference
    newReference(ref: ProtocolReference): void;
    updateReference(update: ProtocolReferenceUpdate): void;
    reportReferenceError(error: ProtocolReferenceError): void;

    // Expression
    newExpression(expr: ProtocolExpression): void;
    updateExpression(update: ProtocolExpressionUpdate): void;
    reportExpressionCalculationError(error: ProtocolExpressionError): void;

    // Components
    createComponent(comp: ProtocolComponent): void;
    componentProperty(prop: ProtocolComponentProperty): void;
    createTag(tag: ProtocolTag): void;
    tagAttr(attr: ProtocolTagAttr): void;
    tagClass(cls: ProtocolTagClass): void;
    tagStyle(style: ProtocolTagStyle): void;
    tagEvent(event: ProtocolTagEvent): void;
    tagBind(bind: ProtocolTagBind): void;
    tagCallback(callback: ProtocolTagCallback): void;
    tagOnDestroy(onDestroy: ProtocolTagOnDestroy): void;
    createNode(node: ProtocolNode): void;
    addContextState(state: ProtocolState): void;
    setElementParent(parent: ProtocolParent): void;
    reportComponentError(error: ProtocolError): void;
    reportComponentSlotError(error: ProtocolSlotError): void;
    composeTime(time: ProtocolComposeTime): void;

    // Models
    createModel(model: ProtocolModel): void;
    createModelItem(item: ProtocolModelItem): void;
    updateModel(update: ProtocolModelUpdate): void;
    updateModelArg(arg: ProtocolModelUpdateArg): void;
    createStore(store: ProtocolStore): void;
    createCustomModel(model: ProtocolCustomModel): void;
    customModelProperty(item: ProtocolCustomModelProperty): void;

    // routes
    registeredRoute(routes: ProtocolRoute): void;
    routerStateChange(change: ProtocolRouterStateChange): void;
    routerActionCall(call: ProtocolRouterActionCall): void;
    routerTargetResult(data: ProtocolRouterTargetResult): void;
    routerTargetResultQueryArg(arg: ProtocolRouterTargetResultQueryArg): void;

    // function
    functionCall(call: ProtocolFunctionCall): void;
    functionCallArg(arg: ProtocolFunctionCallArg): void;
    functionReturn(result: ProtocolFunctionResult): void;
    functionThrows(error: ProtocolFunctionError): void;
    eventTrigger(call: ProtocolEventTrigger): void;

    // objects
    newObject(obj: ProtocolObject): void;
    updateObject(update: ProtocolObjectUpdate): void;
    objectProperty(prop: ProtocolObjectProperty): void;

    // css
    cssInjector(injector: ProtocolCssInjector): void;
    cssRule(rule: ProtocolCssRule): void;

    // any
    destroy(data: DestroyData): void;
    erase(data: EraseData): void;
}

export abstract class AbstractInspector implements Inspector {
    public addContextState(state: ProtocolState): void {
        this.send("addContextState", state);
    }

    public componentProperty(prop: ProtocolComponentProperty): void {
        this.send("componentProperty", prop);
    }

    public composeTime(time: ProtocolComposeTime): void {
        this.send("composeTime", time);
    }

    public createComponent(comp: ProtocolComponent): void {
        this.send("createComponent", comp);
    }

    public createCustomModel(model: ProtocolCustomModel): void {
        this.send("createCustomModel", model);
    }

    public createModel(model: ProtocolModel): void {
        this.send("createModel", model);
    }

    public createModelItem(item: ProtocolModelItem): void {
        this.send("createModelItem", item);
    }

    public createNode(node: ProtocolNode): void {
        this.send("createNode", node);
    }

    public createStore(store: ProtocolStore): void {
        this.send("createStore", store);
    }

    public createTag(tag: ProtocolTag): void {
        this.send("createTag", tag);
    }

    public cssInjector(injector: ProtocolCssInjector): void {
        this.send("cssInjector", injector);
    }

    public cssRule(rule: ProtocolCssRule): void {
        this.send("cssRule", rule);
    }

    public customModelProperty(item: ProtocolCustomModelProperty): void {
        this.send("customModelProperty", item);
    }

    public destroy(data: DestroyData): void {
        this.send("destroy", data);
    }

    public erase(data: EraseData) {
        this.send("erase", data);
    }

    public eventTrigger(call: ProtocolEventTrigger) {
        this.send("eventTrigger", call);
    }

    public functionCall(call: ProtocolFunctionCall): void {
        this.send("functionCall", call);
    }

    public functionCallArg(arg: ProtocolFunctionCallArg): void {
        this.send("functionCallArg", arg);
    }

    public functionReturn(result: ProtocolFunctionResult): void {
        this.send("functionReturn", result);
    }

    public functionThrows(error: ProtocolFunctionError): void {
        this.send("functionThrows", error);
    }

    public newExpression(expr: ProtocolExpression): void {
        this.send("newExpression", expr);
    }

    public newObject(obj: ProtocolObject): void {
        this.send("newObject", obj);
    }

    public newReference(ref: ProtocolReference): void {
        this.send("newReference", ref);
    }

    public objectProperty(prop: ProtocolObjectProperty): void {
        this.send("objectProperty", prop);
    }

    public registerExecutionPosition(pos: ProtocolExecutionPosition): void {
        this.send("registerExecutionPosition", pos);
    }

    public registeredRoute(routes: ProtocolRoute): void {
        this.send("registeredRoute", routes);
    }

    public reportComponentError(error: ProtocolError): void {
        this.send("reportComponentError", error);
    }

    public reportComponentSlotError(error: ProtocolSlotError): void {
        this.send("reportComponentSlotError", error);
    }

    public reportError(err: ProtocolError) {
        this.send("reportError", err);
    }

    public reportExpressionCalculationError(error: ProtocolExpressionError): void {
        this.send("reportExpressionCalculationError", error);
    }

    public reportReferenceError(error: ProtocolReferenceError): void {
        this.send("reportReferenceError", error);
    }

    public routerActionCall(call: ProtocolRouterActionCall): void {
        this.send("routerActionCall", call);
    }

    public routerStateChange(change: ProtocolRouterStateChange): void {
        this.send("routerStateChange", change);
    }

    public routerTargetResult(data: ProtocolRouterTargetResult): void {
        this.send("routerTargetResult", data);
    }

    public routerTargetResultQueryArg(arg: ProtocolRouterTargetResultQueryArg): void {
        this.send("routerTargetResultQueryArg", arg);
    }

    public setElementParent(parent: ProtocolParent): void {
        this.send("setElementParent", parent);
    }

    public tagAttr(attr: ProtocolTagAttr): void {
        this.send("tagAttr", attr);
    }

    public tagBind(bind: ProtocolTagBind): void {
        this.send("tagBind", bind);
    }

    public tagCallback(callback: ProtocolTagCallback): void {
        this.send("tagCallback", callback);
    }

    public tagClass(cls: ProtocolTagClass): void {
        this.send("tagClass", cls);
    }

    public tagEvent(event: ProtocolTagEvent): void {
        this.send("tagEvent", event);
    }

    public tagOnDestroy(onDestroy: ProtocolTagOnDestroy): void {
        this.send("tagOnDestroy", onDestroy);
    }

    public tagStyle(style: ProtocolTagStyle): void {
        this.send("tagStyle", style);
    }

    public updateExpression(update: ProtocolExpressionUpdate): void {
        this.send("updateExpression", update);
    }

    public updateModel(update: ProtocolModelUpdate): void {
        this.send("updateModel", update);
    }

    public updateModelArg(arg: ProtocolModelUpdateArg): void {
        this.send("updateModelArg", arg);
    }

    public updateObject(update: ProtocolObjectUpdate): void {
        this.send("updateObject", update);
    }

    public updateReference(update: ProtocolReferenceUpdate): void {
        this.send("updateReference", update);
    }

    protected abstract send(name: keyof Inspector, data: object): void;
}

export class EarlyInspector extends AbstractInspector {
    protected inspector: Inspector | undefined;
    protected queue: [string, object][] = [];

    public connect(inspector: Inspector) {
        this.inspector = inspector;

        for (const item of this.queue) {
            inspector[item[0]](item[1]);
        }
        this.queue = [];
    }

    protected send(name: string, data: object) {
        if (this.inspector) {
            this.inspector[name](data);
        } else {
            this.queue.push([name, data]);
        }
    }
}

export const inspector = new EarlyInspector();

let id = 0;

export function provideId() {
    return id++;
}

export interface DevValue {
    type: string;
    value?: string | undefined;
    id?: number;
    length?: number;
}

const primitiveTypes: string[] = ["number", "string", "boolean"] as const;

const positionKey = Symbol("vasille-position");
const objectKey = Symbol("vasille-object");
let executionId = 0;

export function setupPosition<T extends object>(obj: T, declaration: StaticPosition): T {
    Object.defineProperty(obj, positionKey, {
        value: declaration,
        enumerable: false,
        configurable: false,
        writable: false,
    });
    return obj;
}

export function getPosition(obj: object): StaticPosition | undefined {
    return obj[positionKey] as StaticPosition | undefined;
}

export function wrapFn<Args extends unknown[], Result extends object>(
    fn: (...args: Args) => Result,
    declaration: StaticPosition,
): (...args: Args) => Result {
    return setupPosition((...args: Args) => {
        return runFn(fn, args, declaration);
    }, declaration);
}

export function runFn<Args extends unknown[], Result extends object>(
    fn: (...args: Args) => Result,
    args: Args,
    declaration: StaticPosition,
): Result {
    const id = ++executionId;

    inspector.functionCall({
        id: id,
        position: declaration,
        time: Date.now(),
    });
    args.forEach(arg => inspector.functionCallArg({ id, value: toDevIdOrValue(arg) }));

    try {
        let result: Result = fn(...args);

        if (result instanceof Promise) {
            return new Promise<Awaited<Result>>((resolve, reject) => {
                result.then(result => {
                    inspector.functionReturn({
                        id: id,
                        result: toDevValue(result),
                        async: true,
                        time: Date.now(),
                    });
                    resolve(result);
                });
                result.catch(e => {
                    inspector.functionThrows({
                        id: id,
                        error: errorToString(e),
                        async: true,
                        time: Date.now(),
                    });
                    reject(e);
                });
            }) as unknown as Result;
        } else {
            inspector.functionReturn({
                id: id,
                result: toDevValue(result),
                async: false,
                time: Date.now(),
            });

            return result;
        }
    } catch (e) {
        inspector.functionThrows({
            id: id,
            error: errorToString(e),
            async: false,
            time: Date.now(),
        });
        throw e;
    }
}

interface ObjectMetaData extends Inspectable {
    fields: { [k: string]: unknown };
}

let objectId = 0;

export function processObject(obj: object, pos?: StaticPosition): number {
    const time = Date.now();

    if (objectKey in obj) {
        const changes: [key: string, value: DevValue][] = [];
        const meta = obj[objectKey] as ObjectMetaData;
        const fields = meta.fields;

        for (const [key, value] of Object.entries(obj)) {
            if (obj[key] !== fields[key]) {
                changes.push([key, toDevValue(value)]);
            }
        }

        if (changes.length > 0) {
            inspector.updateObject({
                id: meta.id,
                time: time,
            });
            changes.forEach(change => {
                inspector.objectProperty({
                    id: meta.id,
                    name: change[0],
                    value: change[1],
                    time: time,
                });
            });
        }
        return meta.id;
    } else {
        const id = ++objectId;
        const fields: { [k: string]: unknown } = {};

        inspector.newObject({
            id: id,
            constructor: obj.constructor.name,
            time: time,
            position: pos,
        });

        for (const [key, value] of Object.entries(obj)) {
            fields[key] = value;
            inspector.objectProperty({
                id: id,
                name: key,
                value: toDevValue(value),
                time: time,
            });
        }

        Object.defineProperty(obj, objectKey, {
            value: {
                id: id,
                fields: fields,
            },
            enumerable: false,
            configurable: false,
            writable: false,
        });

        return id;
    }
}

export function wrapObject<T extends object>(v: T, declaration: StaticPosition): T {
    processObject(v, declaration);
    return v;
}

export function toDevValue(value: unknown): DevValue {
    const type = typeof value;

    return {
        type: type,
        value:
            primitiveTypes.includes(type) || value === null
                ? JSON.stringify(value)
                : typeof value === "object"
                  ? `${processObject(value)}`
                  : typeof value === "function"
                    ? (JSON.stringify(getPosition(value)) ?? value.name)
                    : undefined,
        id: toDevId(value),
        length: Array.isArray(value) ? value.length : typeof value === "string" ? value.length : undefined,
    };
}

export function toDevId(value: unknown): number | undefined {
    if (
        value instanceof IValue ||
        value instanceof DevArrayModel ||
        value instanceof DevMapModel ||
        value instanceof DevSetModel
    ) {
        return value.id;
    }

    return undefined;
}

export function toDevIdOrValue(value: unknown): number | DevValue {
    return toDevId(value) ?? toDevValue(value);
}

export function processDevObject(
    value: object | undefined,
    run: (key: string, value: number | DevValue) => void,
): void {
    if (value) {
        Object.entries(value).forEach(([key, value]) => run(key, toDevIdOrValue(value)));
    }
}

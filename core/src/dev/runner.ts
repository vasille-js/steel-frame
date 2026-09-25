import { CssStyleInjector } from "vasille-css";
import { IValue } from "../core/ivalue.js";
import { TextProps } from "../node/node.js";
import { IRunner } from "../node/runner.js";
import { Runner, Tag, TagOptions, TextNode } from "../runner/web/runner.js";
import {
    getPosition,
    inspector,
    provideId,
    StaticPosition,
    toDevId,
    toDevIdOrValue,
    processDevObject,
    toDevValue,
} from "./inspectable.js";
import { DevExpression, DevReference } from "./state.js";

export interface DevTagOptions extends TagOptions {
    usage?: StaticPosition;
}

export class PositionedText {
    public text: unknown;
    public position: StaticPosition;

    public constructor(text: unknown, position: StaticPosition) {
        this.text = text;
        this.position = position;
    }
}

export function positionedText(text: unknown, position: StaticPosition) {
    return new PositionedText(text, position);
}

export class DevTextNode extends TextNode<DevTagOptions, DevRunner> {
    public override id: number;

    public constructor(input: TextProps, runner: DevRunner, deep: number, usage: StaticPosition) {
        super(input, runner, deep);
        this.id = provideId();

        inspector.createNode({
            id: this.id,
            time: Date.now(),
            text: toDevIdOrValue(input.text),
            position: usage,
        });
    }

    public override destroy(deep: number, keepNodes?: boolean): void {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }

    public override compose(): void {
        super.compose();
        Object.defineProperty(this.node, "vasille", { value: this.id, configurable: false, enumerable: false });
    }
}

export function remapObject<Before, After>(
    obj: { [k: string]: Before } | undefined,
    transform: (v: Before) => After,
): { [k: string]: After } {
    const r: { [k: string]: After } = {};

    for (const key in obj) {
        r[key] = transform(obj[key]!);
    }

    return r;
}

export class DevTag extends Tag<DevTagOptions, DevRunner> {
    public override id: number;

    public constructor(
        options: DevTagOptions,
        runner: DevRunner,
        deep: number,
        tagName: string,
        usage: StaticPosition | undefined,
    ) {
        super(options, runner, tagName, deep);

        const id = (this.id = provideId());

        inspector.createTag({
            id: this.id,
            time: Date.now(),
            tagName: tagName,
            usage: usage,
        });

        if (options.k) {
            inspector.tagCallback({
                id: id,
                value: toDevIdOrValue(options.k),
            });
        }
        if (options.d) {
            inspector.tagOnDestroy({
                id: id,
                value: toDevIdOrValue(options.d),
            });
        }
        processDevObject(options.a, (key, value) => {
            inspector.tagAttr({
                id: id,
                name: key,
                value: value,
            });
        });
        if (options.c) {
            for (const item of options.c) {
                const value = item instanceof CssStyleInjector ? item.inject() : item instanceof IValue ? item.V : item;

                if (typeof value === "string") {
                    inspector.tagClass({ id: id, value: toDevId(item) ?? value, name: value });
                } else {
                    processDevObject(value, (name, condition) => {
                        inspector.tagClass({ id, name, value: toDevId(condition) ?? (condition ? "true" : "false") });
                    });
                }
            }
        }
        processDevObject(options.s, (name, value) => {
            inspector.tagStyle({ id, name, value });
        });
        processDevObject(options.e, (name, value) => {
            inspector.tagEvent({ id, name, value });
        });
        processDevObject(options.b, (name, value) => {
            inspector.tagBind({ id, name, value });
        });
    }

    public override applyOptions(options: DevTagOptions): void {
        if (options.e) {
            for (const [key, handler] of Object.entries(options.e)) {
                const userHandler = handler instanceof Array ? handler[0] : handler;
                const evOptions = handler instanceof Array ? handler[1] : {};

                options.e[key] = [
                    ev => {
                        inspector.eventTrigger({
                            target: this.id,
                            eventName: key,
                            time: Date.now(),
                            position: getPosition(handler[0]),
                        });
                        userHandler(ev);
                    },
                    evOptions,
                ];
            }
        }
        super.applyOptions(options);
    }

    public override destroy(deep: number, keepNodes?: boolean): void {
        inspector.destroy({ id: this.id, time: Date.now() });
        super.destroy(deep, keepNodes);
    }

    public override compose(): void {
        super.compose();
        Object.defineProperty(this.node, "vasille", { value: this.id, configurable: false, enumerable: false });
    }
}

export class DevRunner extends Runner<DevTagOptions> implements IRunner<Node, Element, DevTagOptions> {
    public override textNode(deep: number, text: unknown): TextNode<DevTagOptions, DevRunner> {
        if (text instanceof PositionedText) {
            return new DevTextNode({ text: text.text }, this, deep, text.position);
        }

        return new TextNode({ text: text }, this, deep);
    }

    public override tag(
        deep: number,
        tagName: string,
        input: DevTagOptions,
        cb?: ((ctx: DevTag) => void) | undefined,
    ): DevTag {
        if (cb) {
            input.l = cb;
        }

        return new DevTag(input, this, deep, tagName, input.usage);
    }
}

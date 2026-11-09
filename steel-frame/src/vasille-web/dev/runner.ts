import { WebRunner, WebTag, WebTagOptions, WebTextNode } from "../web/runner/runner.js";
import {
    getPosition,
    inspector,
    processDevObject,
    provideId,
    StaticPosition,
    toDevIdOrValue,
} from "../../vasille/dev/index.js";
import { IRunner } from "../../vasille/index.js";
import { CssStyleInjector } from "../web/css/index.js";
import { Root } from "../../vasille/classes/node/node.js";

export interface DevWebTagOptions extends WebTagOptions {
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

export class DevWebTextNode extends WebTextNode<DevWebTagOptions, DevWebRunner> {
    public override id: number;

    public constructor(
        text: unknown,
        parent: Root<Node, Element, DevWebTagOptions, DevWebRunner>,
        usage: StaticPosition,
    ) {
        super(text, parent);
        this.id = provideId();

        inspector.createNode({
            id: this.id,
            time: Date.now(),
            text: toDevIdOrValue(text),
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

export class DevWebTag extends WebTag<DevWebTagOptions, DevWebRunner> {
    public override id: number;

    public constructor(
        options: DevWebTagOptions,
        parent: Root<Node, Element, DevWebTagOptions, DevWebRunner>,
        tagName: string,
        usage: StaticPosition | undefined,
    ) {
        super(options, parent, tagName);

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
                const value = item instanceof CssStyleInjector ? item.inject() : item;

                inspector.tagClass({ id: id, value: toDevIdOrValue(value) });
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

    public override applyOptions(options: DevWebTagOptions): void {
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
                            position: getPosition(userHandler),
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

export class DevWebRunner extends WebRunner<DevWebTagOptions> implements IRunner<Node, Element, DevWebTagOptions> {
    public override textNode(
        text: unknown,
        parent: Root<Node, Element, DevWebTagOptions, DevWebRunner>,
    ): WebTextNode<DevWebTagOptions, DevWebRunner> {
        if (text instanceof PositionedText) {
            return new DevWebTextNode({ text: text.text }, parent, text.position);
        }

        return new WebTextNode(text, parent);
    }

    public override tag(
        parent: Root<Node, Element, DevWebTagOptions, DevWebRunner>,
        tagName: string,
        input: DevWebTagOptions,
        cb?: ((ctx: DevWebTag) => void) | undefined,
    ): DevWebTag {
        if (cb) {
            input.l = cb as any;
        }

        return new DevWebTag(input, parent, tagName, input.usage);
    }
}

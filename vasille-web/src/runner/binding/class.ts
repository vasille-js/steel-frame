import { Binding } from "./binding.js";
import type { Tag } from "../../../node/node.js";
import type { IValue } from "../../../core/ivalue.js";

export abstract class AbstractCssStyleInjector {
    public abstract inject(): string;
}

export function addClass(node: Tag<Node, Element, object>, cl: string) {
    node.node?.classList.add(cl);
}

export function removeClass(node: Tag<Node, Element, object>, cl: string) {
    node.node?.classList.remove(cl);
}

export class DynamicalClassBinding extends Binding<string | AbstractCssStyleInjector | false | null | undefined> {
    private current = "";

    constructor(
        node: Tag<Node, Element, object>,
        value: IValue<string | AbstractCssStyleInjector | false | null | undefined, unknown>,
    ) {
        super(value);
        this.init(value => {
            /* istanbul ignore else */
            if (this.current != value) {
                if (this.current.length) {
                    removeClass(node, this.current);
                }
                /* istanbul ignore else */
                if (value instanceof AbstractCssStyleInjector) {
                    addClass(node, (this.current = value.inject()));
                } else if (typeof value === "string" && value.length) {
                    addClass(node, value);
                } else {
                    this.current = "";
                }
            }
        });
    }
}

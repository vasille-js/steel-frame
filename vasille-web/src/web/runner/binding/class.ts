import { Binding } from "./binding.js";
import { CssStyleInjector } from "../../css/index.js";
import { IValue, Tag } from "vasille";

export function addClass(node: Tag<Node, Element, object>, cl: string) {
    node.node?.classList.add(cl);
}

export function removeClass(node: Tag<Node, Element, object>, cl: string) {
    node.node?.classList.remove(cl);
}

export class DynamicalClassBinding extends Binding<string | CssStyleInjector | false | null | undefined> {
    private current = "";

    constructor(
        node: Tag<Node, Element, object>,
        value: IValue<string | CssStyleInjector | false | null | undefined, unknown>,
    ) {
        super(value);
        this.init(value => {
            /* istanbul ignore else */
            if (this.current != value) {
                if (this.current.length) {
                    removeClass(node, this.current);
                }
                /* istanbul ignore else */
                if (value instanceof CssStyleInjector) {
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

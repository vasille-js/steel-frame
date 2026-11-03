import { Binding } from "./binding.js";
import { IValue, Tag } from "vasille";

/**
 * Represents an Attribute binding description
 * @class AttributeBinding
 * @extends Binding
 */
export class AttributeBinding extends Binding<string | number | boolean | string[] | null | undefined> {
    /**
     * Constructs an attribute binding description
     * @param node {INode} the vasille node
     * @param name {String} the name of attribute
     * @param value {IValue} value to bind
     */
    public constructor(
        node: Tag<Node, Element, object>,
        name: string,
        value: IValue<string | number | boolean | string[] | null | undefined, unknown>,
    ) {
        const isAria = name.startsWith("aria-");

        super(value);

        this.init(value => {
            if (value || value === 0) {
                if (typeof value === "boolean") {
                    node.node!.setAttribute(name, isAria ? "true" : "");
                } else {
                    node.node!.setAttribute(name, value instanceof Array ? value.join(" ") : `${value}`);
                }
            } else if (isAria) {
                node.node!.setAttribute(name, "false");
            } else {
                node.node!.removeAttribute(name);
            }
        });
    }
}

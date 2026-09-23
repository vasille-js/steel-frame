import { Fragment } from "vasille";
import { ScreenProps } from "./types.js";

function createFragment<Node, Element, TagOptions extends object>(node: Fragment<Node, Element, TagOptions>) {
    return new Fragment<Node, Element, TagOptions>(node.runner, node.sDeep + 1);
}

export function createScreen<F extends Fragment<unknown, unknown, object>, Route extends string>(
    renderer: (node: F, input: ScreenProps<Route>) => Promise<void>,
    create: (node: F, props: ScreenProps<Route>) => F,
): (props: ScreenProps<Route>, ctx?: F) => Promise<void> {
    return async function (props, node) {
        if (!node) {
            throw new Error("Vasille: Screen context is missing");
        }

        const frag = create(node, props);

        node.child(frag);

        await renderer(frag, props);
    };
}

export function screen<Node, Element, TagOptions extends object, Route extends string>(
    renderer: (node: Fragment<Node, Element, TagOptions>, input: ScreenProps<Route>) => Promise<void>,
): (props: ScreenProps<Route>, ctx?: Fragment<Node, Element, TagOptions>) => Promise<void> {
    return createScreen<Fragment<Node, Element, TagOptions>, Route>(renderer, createFragment);
}

import { Fragment, Portal } from "vasille";
import { Runner, Node, Element, type TagOptions } from "./runner.js";
import { view } from "vasille-jsx";

export { safe } from "vasille";
export {
    ensure,
    ref,
    expr,
    expr as bind,
    expr as calculate,
    expr as watch,
    set,
    Delay,
    For,
    Slot,
    Watch,
    store,
    model,
    setModel,
    mapModel,
    arrayModel,
    Switch,
    setErrorHandler,
    match,
    view,
    debounceRef,
    edgeRef,
    toDeepFieldRef,
    toFieldRef,
    safeRef,
    safeExpr,
    safeInit,
    abortSignal,
    // no zombies in SSG
    Slot as Zombie,
} from "vasille-jsx";

export { styleSheet } from "./css.js";
export { setMobileMaxWidth, setTabletMaxWidth, setLaptopMaxWidth } from "vasille-css";

export { context, impute, receive, share } from "vasille-context";

export {
    type QueryParams,
    type ScreenProps,
    type RouteParameters,
    screen,
    screen as page,
    type FallbackScreenProps,
    type ErrorScreenProps,
} from "vasille-router";

export { awaited } from "./awaited.js";
export { routerApp, type Mode } from "./router.js";

interface CompositionProps {
    slot?: (...args: any[]) => void;
}

export const component = view;
export const compose = view;

export function modal<T extends CompositionProps>(
    modal: (node: Fragment<Node, Element, TagOptions, Runner>, input: T) => void,
): (input: T, node: Fragment<Node, Element, TagOptions, Runner>) => void {
    return function (props, node) {
        if (!node) {
            throw new Error("Vasille: Modal context is missing");
        }
        const runner: Runner = node.runner;
        const portal = new Portal<Node, Element, TagOptions, Runner>(runner.body, runner, node.sDeep + 1);

        node.child(portal);
        modal(portal, props);
    };
}

// no prompts support in SSG
export function prompt(compose: () => void): () => void {
    return function () {
        compose();
        throw new Error("User input is not supported in SSG");
    };
}

// SSG works only with file-based router
export function mount() {
    throw new Error("SSG app can not be mounted");
}

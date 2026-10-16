import { Fragment, PortalNode, view } from "vasille";
import { SsgRunner, Node, Element, type SsgTagOptions } from "./runner.js";

export { safe } from "vasille";
export {
    ensure,
    ref,
    expr,
    expr as bind,
    expr as calculate,
    expr as watch,
    expr as live,
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
    debounceRef as debounced,
    toDeepFieldRef,
    toFieldRef,
    safeRef as safeState,
    safeExpr as safeLive,
    safeInit,
    abortSignal,
    // no zombies in SSG
    Slot as Zombie,
    ArrayModelView,
    expr as effect,
    ArrayView,
    MapModelView,
    SetModelView,
    QueuedRender,
    receiveOptional,
    SteelContext,
    Model,
} from "vasille";

export { styleSheet } from "./css.js";
export { setMobileMaxWidth, setTabletMaxWidth, setLaptopMaxWidth } from "../web/index.js";

export { context, impute, receive, share } from "vasille";

export { screen, screen as page } from "vasille";

export { awaited } from "./awaited.js";
export { routerApp } from "./router.js";

interface CompositionProps {
    slot?: (...args: any[]) => void;
}

export const component = view;
export const compose = view;

export function modal<T extends CompositionProps>(
    modal: (node: Fragment<Node, Element, SsgTagOptions, SsgRunner>, input: T) => void,
): (input: T, node: Fragment<Node, Element, SsgTagOptions, SsgRunner>) => void {
    return function (props, node) {
        if (!node) {
            throw new Error("Vasille: Modal context is missing");
        }
        const runner: SsgRunner = node.runner;
        const portal = new PortalNode<Node, Element, SsgTagOptions, SsgRunner>(runner.body, runner, node.sDeep + 1);

        node.child(portal);
        modal(portal, props);
    };
}

// no prompts support in SSG

export class Prompt {}

export function prompt(): void {
    new Prompt();
}

export function showPrompt(): void {
    throw new Error("User input is not supported in SSG");
}

// SSG works only with file-based router
export function mount() {
    throw new Error("SSG app can not be mounted");
}

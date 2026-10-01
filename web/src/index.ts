import { App, Fragment, Portal, reportError, Runner as IRunner } from "vasille";
import { Runner, TagOptions } from "vasille/web-runner";
import { CompositionProps, mount as coreMount } from "vasille-jsx";
import { routeApp as coreRouteApp, WebRouterInitialization } from "vasille-router/web-router";

export { styleSheet } from "vasille-css";
export type { RawStyleProps as StyleProps, StyleSheetProps } from "./spec/css.js";
export type { ClassItem } from "./jsx-runtime.js";
export { safe } from "vasille";

export {
    view,
    view as component,
    view as compose,
    ensure,
    ref,
    expr,
    expr as bind,
    expr as calculate,
    expr as computed,
    expr as watch,
    set,
    Delay,
    For,
    Slot,
    Watch,
    awaited,
    store,
    model,
    setModel,
    mapModel,
    arrayModel,
    Switch,
    setErrorHandler,
    match,
    ArrayView,
    ArrayModelView,
    MapModelView,
    SetModelView,
    QueuedRender,
    debounceRef,
    edgeRef,
    safeExpr,
    safeExpr as safeBind,
    safeExpr as safeComputed,
    safeRef,
    toDeepFieldRef,
    toFieldRef,
    Zombie,
    abortSignal,
} from "vasille-jsx";

export {
    type QueryParams,
    type ScreenProps,
    type RouteParameters,
    screen,
    screen as page,
    type FallbackScreenProps,
    type ErrorScreenProps,
} from "vasille-router";

export { Router, type WebRouterInitialization, type NavigationMode } from "vasille-router/web-router";

export { setMobileMaxWidth, setTabletMaxWidth, setLaptopMaxWidth } from "vasille-css";

export { context, impute, receive, share, receiveOptional } from "vasille-context";

function createPortal(node: Fragment<Node, Element, TagOptions>) {
    const portal = new Portal<Node, Element, TagOptions>(document.body, node.runner, node.sDeep + 1);

    node.child(portal);

    return portal;
}

export function modal<T extends CompositionProps>(
    modal: (node: Fragment<Node, Element, TagOptions>, input: T) => void,
    create: (node: Fragment<Node, Element, TagOptions>) => Portal<Node, Element, TagOptions> = createPortal,
): (input: T, node: Fragment<Node, Element, TagOptions>, slot?: T["slot"]) => void {
    return function (props, node, slot) {
        if (!node) {
            throw new Error("Vasille: Modal context is missing");
        }
        const portal = create(node);

        if (!props.slot && slot) {
            props.slot = slot;
        }

        try {
            modal(portal, props);
        } catch (e) {
            reportError(e);
        }
    };
}

export interface PromptProps {
    resolve(data: unknown): void;
    reject(err: unknown): void;
}

export class Prompt<T extends PromptProps, Extra extends [number, ...unknown[]]> {
    constructor(
        private readonly modal: (node: Fragment<Node, Element, TagOptions>, input: T) => void,
        private readonly create: (
            node: Fragment<Node, Element, TagOptions>,
            extra: Extra,
        ) => Portal<Node, Element, TagOptions>,
        private readonly debugProps?: PromptProps,
    ) {}

    public show(node: Fragment<Node, Element, TagOptions>, input: T, ...extra: Extra): Promise<unknown> {
        const { modal, create, debugProps } = this;

        return new Promise((resolve, reject) => {
            const portal = create(node, extra);
            const timer =
                extra[0] &&
                setTimeout(() => {
                    destroy();
                    reject(new Error("Timeout"));
                }, extra[0]);

            function destroy() {
                timer && clearTimeout(timer);
                portal.destroy(portal.sDeep);
            }

            try {
                modal(portal, {
                    ...input,
                    resolve(value) {
                        destroy();
                        debugProps?.resolve(value);
                        resolve(value);
                    },
                    reject(error) {
                        destroy();
                        debugProps?.reject(error);
                        reject(error);
                        reject(error);
                    },
                });
            } catch (e) {
                destroy();
                reject(e);
            }
        });
    }
}

export function prompt<T extends PromptProps, Extra extends [number, ...unknown[]]>(
    modal: (node: Fragment<Node, Element, TagOptions>, input: T) => void,
    create: (node: Fragment<Node, Element, TagOptions>) => Portal<Node, Element, TagOptions> = createPortal,
): Prompt<T, Extra> {
    return new Prompt<T, Extra>(modal, create);
}

export function showPrompt<T extends PromptProps, Extra extends [number, ...unknown[]]>(
    ctx: Fragment<Node, Element, TagOptions>,
    prompt: Prompt<T, Extra>,
    input: T,
    ...args: Extra
): Promise<unknown> {
    return prompt.show(ctx, input, ...args);
}

export function mount<T>(element: Element, component: ($: T) => void, input: T): App<Node, Element, TagOptions> {
    return coreMount<Node, Element, TagOptions, T>(element, component, new Runner(window.document), input);
}

export function routerApp<Routes extends string>(
    init: WebRouterInitialization<Routes>,
    element?: Element,
): App<Node, Element, TagOptions> {
    return coreRouteApp(element ?? document.body, window, window.location, init);
}

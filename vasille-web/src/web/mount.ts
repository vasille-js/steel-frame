import { AppNode, CompositionProps, Fragment, mountApp, PortalNode, reportError } from "vasille";
import { WebRunner, WebTagOptions } from "./runner/runner.js";
import { webRouterApp, WebRouterInitialization } from "./router/router.js";

function createPortal(node: Fragment<Node, Element, WebTagOptions>) {
    const portal = new PortalNode<Node, Element, WebTagOptions>(document.body, node.runner, node.sDeep + 1);

    node.child(portal);

    return portal;
}

export function modal<T extends CompositionProps>(
    modal: (node: Fragment<Node, Element, WebTagOptions>, input: T) => void,
    create: (node: Fragment<Node, Element, WebTagOptions>) => PortalNode<Node, Element, WebTagOptions> = createPortal,
): (input: T, node?: Fragment<Node, Element, WebTagOptions>, slot?: T["slot"]) => void {
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
        private readonly modal: (node: Fragment<Node, Element, WebTagOptions>, input: T) => void,
        private readonly create: (
            node: Fragment<Node, Element, WebTagOptions>,
            extra: Extra,
        ) => PortalNode<Node, Element, WebTagOptions>,
        private readonly debugProps?: PromptProps,
    ) {}

    public show(
        node: Fragment<Node, Element, WebTagOptions>,
        input: Omit<T, "resolve" | "reject">,
        ...extra: Extra
    ): Promise<unknown> {
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
                    ...(input as unknown as T),
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
    modal: (node: Fragment<Node, Element, WebTagOptions>, input: T) => void,
    create: (node: Fragment<Node, Element, WebTagOptions>) => PortalNode<Node, Element, WebTagOptions> = createPortal,
): Prompt<T, Extra> {
    return new Prompt<T, Extra>(modal, create);
}

export function showPrompt<T extends PromptProps, Extra extends [number, ...unknown[]]>(
    ctx: Fragment<Node, Element, WebTagOptions>,
    prompt: Prompt<T, Extra>,
    input: Omit<T, "resolve" | "reject">,
    ...args: Extra
): Promise<unknown> {
    return prompt.show(ctx, input, ...args);
}

export function mount<T>(
    element: Element,
    component: ($: T, node: Fragment<Node, Element, WebTagOptions>) => void,
    input: T,
): AppNode<Node, Element, WebTagOptions> {
    return mountApp<Node, Element, WebTagOptions, T>(element, component, new WebRunner(window.document), input);
}

export function routerApp<Routes extends string>(
    init: WebRouterInitialization<Routes>,
    element?: Element,
): AppNode<Node, Element, WebTagOptions> {
    return webRouterApp(element ?? document.body, window, window.location, init);
}

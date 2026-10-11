import { devRouterApp } from "./router.js";
import { CompositionProps, Fragment, IRunner } from "vasille";
import { SsgTagOptions } from "../ssg/runner.js";
import {
    DevAppNode,
    devDynamicalModule,
    DevFragment,
    DevFragmentMap,
    devMountApp,
    DevPortalNode,
    errorToString,
    Inspector,
    inspector,
    StaticPosition,
    toDevValue,
} from "vasille/dev";
import { modal, Prompt } from "../web/index.js";
import { DevWebRunner, DevWebTagOptions } from "./runner.js";
import { WebRouterInitialization } from "../web/router/router.js";
import { PromptProps } from "../web/mount.js";

function createPortal<Runner extends IRunner<Node, Element, SsgTagOptions>>(
    node: Fragment<Node, Element, SsgTagOptions>,
    declaration: StaticPosition | undefined,
    usage: StaticPosition | undefined,
    name: string | undefined,
) {
    const portal = new DevPortalNode<Node, Element, SsgTagOptions, Runner>(
        document.body,
        node.runner as Runner,
        declaration,
        usage,
        name,
    );

    node.child(portal);

    return portal;
}

export function devModal<T extends CompositionProps>(
    modalFn: (node: Fragment<Node, Element, SsgTagOptions>, input: T) => void,
    declaration: StaticPosition,
    name: string,
): (input: T, node: Fragment<Node, Element, SsgTagOptions>, slot?: T["slot"], usage?: StaticPosition) => void {
    const fragments: DevFragmentMap<Node, Element, SsgTagOptions, T> = new Map();
    const run = function (parent: Fragment<Node, Element, SsgTagOptions>, input: T, usage: StaticPosition | undefined) {
        modal<T>(modalFn, node => {
            const portal = createPortal(node, declaration, usage, name);
            const event = {
                position: usage,
                target: portal.id,
            } as const;

            inspector.eventTrigger({
                eventName: "open",
                time: Date.now(),
                ...event,
            });
            portal.runOnDestroy(() => {
                inspector.eventTrigger({
                    eventName: "close",
                    time: Date.now(),
                    ...event,
                });
            });

            return portal;
        })(input, parent, undefined);
    };

    const renderer = (
        input: T,
        node?: Fragment<Node, Element, SsgTagOptions>,
        slot?: T["slot"],
        usage?: StaticPosition,
    ) => {
        if (!node) {
            throw new Error("Vasille: Modal context is missing");
        }
        const frag = new DevFragment<Node, Element, SsgTagOptions>(node.runner, null, null, name, {});

        if (!input.slot && slot) {
            input.slot = slot;
        }

        node.child(frag);
        fragments.set(frag, { props: input, node: frag, usage });
        run(frag, input, usage);
    };

    return devDynamicalModule(renderer, fragments, run);
}

export function devPrompt<T extends PromptProps>(
    modal: (node: Fragment<Node, Element, SsgTagOptions, IRunner<Node, Element, SsgTagOptions>>, input: T) => void,
    declaration: StaticPosition,
    name: string,
): Prompt<T, [number, StaticPosition]> {
    let target: number | undefined;

    return new Prompt<T, [number, StaticPosition]>(
        modal,
        (node, extra) => {
            const portal = createPortal(node, declaration, extra[1], name);
            target = portal.id;

            inspector.eventTrigger({
                eventName: "open",
                time: Date.now(),
                target: target!,
            });

            return portal;
        },
        {
            resolve(data: unknown) {
                if (inspector && target) {
                    inspector.eventTrigger({
                        eventName: "close",
                        time: Date.now(),
                        target,
                        result: {
                            value: toDevValue(data),
                        },
                    });
                }
            },
            reject(err: unknown) {
                if (inspector && target) {
                    inspector.eventTrigger({
                        eventName: "close",
                        time: Date.now(),
                        target,
                        result: {
                            error: errorToString(err),
                        },
                    });
                }
            },
        },
    );
}

export function webDevMountApp<T>(element: Element, component: ($: T) => void, input: T, inspector: Inspector) {
    return devMountApp<T, Node, Element, DevWebTagOptions>(
        element,
        component,
        new DevWebRunner(window.document),
        input,
        inspector,
    );
}

export function webDevRouterApp<Routes extends string>(
    init: WebRouterInitialization<Routes>,
    element: Element,
    inspector: Inspector,
): DevAppNode<Node, Element, DevWebTagOptions> {
    return devRouterApp(element, window, window.location, init, inspector);
}

import { Router, WebRouterInitialization } from "./router.js";
import { DevFragment, DevRunner, DevTagOptions, inspector, Inspector, StaticPosition } from "vasille/dev";
import { Fragment, Runner as IRunner } from "vasille";
import { ScreenProps } from "../types.js";
import { devMount } from "vasille-jsx/dev";
import { createScreen } from "../screen.js";

export function devScreen<Node, Element, TagOptions extends object, Route extends string>(
    renderer: (node: DevFragment<Node, Element, TagOptions>, input: ScreenProps<Route>) => Promise<void>,
    declaration: StaticPosition,
    name: string,
): (
    props: ScreenProps<Route>,
    ctx?: Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
) => Promise<void> {
    return createScreen(
        renderer,
        (node, props) => new DevFragment<Node, Element, TagOptions>(node.runner, declaration, null, name, props),
    );
}

let targetLookUpResultId = 0;

export class DevRouter<Routes extends string> extends Router<Routes> {
    public constructor(
        window: Window,
        location: Location,
        node: Fragment<Node, Element, DevTagOptions, IRunner<Node, Element, DevTagOptions>>,
        init: WebRouterInitialization<Routes>,
    ) {
        super(window, location, node, init);

        const data = Date.now();

        Object.keys(init.routes).forEach(path => {
            inspector.registeredRoute({ path });
        });

        this.$currentUrl.on(value => {
            inspector.routerStateChange({ name: "currentUrl", value, time: Date.now() });
        });
        this.$loadingUrl.on(value => {
            inspector.routerStateChange({ name: "loadingUrl", value, time: Date.now() });
        });
    }

    public goTo(url: string) {
        inspector.routerActionCall({ name: "goTo", path: url, time: Date.now() });
        super.goTo(url);
    }

    public ajax(url: string) {
        inspector.routerActionCall({ name: "ajax", path: url, time: Date.now() });
        super.ajax(url);
    }

    public load(url: string): Promise<void> {
        inspector.routerActionCall({ name: "load", path: url, time: Date.now() });
        return super.load(url);
    }

    public reload() {
        inspector.routerActionCall({ name: "reload", path: this.$currentUrl.V, time: Date.now() });
        super.reload();
    }

    protected targetByUrl(url: string) {
        const result = super.targetByUrl(url);
        const id = ++targetLookUpResultId;

        inspector.routerTargetResult({
            id: id,
            url: result.url,
            path: result.path,
            hash: result.hash,
            params: result.params,
            targetFound: !!result.target,
            time: Date.now(),
        });
        Object.entries(result.query).forEach(([name, values]) => {
            values.forEach(value => {
                inspector.routerTargetResultQueryArg({ id, name, value });
            });
        });

        return result;
    }
}

export function devRouteApp<Routes extends string>(
    node: Element,
    window: Window,
    location: Location,
    init: WebRouterInitialization<Routes>,
    inspector: Inspector,
) {
    const runner = new DevRunner(window.document);

    return devMount<object>(
        node,
        (_data, node) => {
            const router = new DevRouter(window, location, node, init);

            Object.defineProperty(runner, "router", {
                value: router,
            });
        },
        runner,
        {},
        inspector,
    );
}

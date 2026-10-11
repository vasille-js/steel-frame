import { DevFragment, Inspector, inspector, StaticPosition, devMountApp } from "vasille/dev";
import { createScreen, Fragment, IRunner, ScreenProps } from "vasille";
import { WebRouter, WebRouterInitialization } from "../web/router/router.js";
import { DevWebRunner, DevWebTagOptions } from "./runner.js";

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

export class DevWebRouter<Routes extends string> extends WebRouter<Routes> {
    public constructor(
        window: Window,
        location: Location,
        node: Fragment<Node, Element, DevWebTagOptions, IRunner<Node, Element, DevWebTagOptions>>,
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

export function devRouterApp<Routes extends string>(
    node: Element,
    window: Window,
    location: Location,
    init: WebRouterInitialization<Routes>,
    inspector: Inspector,
) {
    const runner = new DevWebRunner(window.document);

    return devMountApp<object, Node, Element, DevWebTagOptions>(
        node,
        (_data, node) => {
            const router = new DevWebRouter(window, location, node, init);

            Object.defineProperty(runner, "router", {
                value: router,
            });
        },
        runner,
        {},
        inspector,
    );
}

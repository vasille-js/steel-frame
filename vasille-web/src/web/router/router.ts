import {
    Answer,
    Fragment,
    mountApp,
    QueryParams,
    Reference,
    reportError,
    Router,
    RouteRenderScope,
    RouterInitialization,
    ScreenProps,
} from "vasille";
import { WebRunner, WebTagOptions } from "../runner/runner.js";

export interface WebRouterInitialization<Routes extends string> extends RouterInitialization<
    Node,
    Element,
    WebTagOptions,
    Routes,
    {}
> {
    loadingScreen?(props: object, node: Fragment<Node, Element, WebTagOptions>): void;
    loadingOverlay?(props: object, node: Fragment<Node, Element, WebTagOptions>): void;
    wrapper?(
        data: { slot(data: object, ctx: Fragment<Node, Element, WebTagOptions>): void },
        ctx: Fragment<Node, Element, WebTagOptions>,
    ): void;
}

export type NavigationMode = "silent" | "loading-screen" | "loading-overlay";

export class WebRouter<Routes extends string> extends Router<
    Node,
    Element,
    WebTagOptions,
    Routes,
    {},
    [NavigationMode]
> {
    public readonly $currentUrl = new Reference<string, unknown>("");
    public readonly $loadingUrl = new Reference<string | null, unknown>(null);

    protected readonly webInit: WebRouterInitialization<Routes>;
    protected readonly window: Window;
    protected readonly location: Location;
    protected readonly node: Fragment<Node, Element, WebTagOptions>;

    protected loadingNode: Fragment<Node, Element, WebTagOptions>;
    protected contentNode: Fragment<Node, Element, WebTagOptions>;
    protected overlayNode: Fragment<Node, Element, WebTagOptions>;

    public constructor(
        window: Window,
        location: Location,
        node: Fragment<Node, Element, WebTagOptions>,
        init: WebRouterInitialization<Routes>,
    ) {
        super(init);
        this.webInit = init;
        this.window = window;
        this.location = location;
        this.node = node;
        this.$currentUrl.V = location.pathname;

        let routerNode = node;

        if (init.wrapper) {
            init.wrapper(
                {
                    slot(_data: object, ctx: Fragment<Node, Element, WebTagOptions>) {
                        routerNode = ctx;
                    },
                },
                node,
            );
        }

        this.build(routerNode, node => (this.loadingNode = node));
        this.build(routerNode, node => (this.contentNode = node));
        this.build(routerNode, node => (this.overlayNode = node));

        window.addEventListener("popstate", () => {
            this.doNavigate(location.href, false, "loading-screen");
        });
        this.doNavigate(location.href, true, "loading-screen");
    }

    /**
     * Navigate to a new page, showing the loading screen
     */
    public goTo(url: string) {
        this.doNavigate(url, true, "loading-screen");
    }

    /**
     * Navigate to a new page in an AJAX way, showing a loading overlay
     */
    public ajax(url: string) {
        this.doNavigate(url, true, "loading-overlay");
    }

    /**
     * Load the new page in the background, will throw on errors
     */
    public load(url: string): Promise<void> {
        return this.prepareNavigation(url, true, true, "silent");
    }

    public reload(): void {
        this.doNavigate(this.$currentUrl.V, true, "loading-screen");
    }

    protected doNavigate(url: string, canNavigate: boolean, mode: NavigationMode) {
        this.prepareNavigation(url, canNavigate, false, mode).catch(e => {
            this.clearLoadings();
            reportError(e);
        });
    }

    protected parseUrl(url: string): [string, QueryParams, string] {
        const parsed = new URL(url, this.location.origin);
        const query = [...parsed.searchParams].reduce((prev, [key]) => {
            return { ...prev, [key]: parsed.searchParams.getAll(key) };
        }, {} as QueryParams);

        return [parsed.pathname, query, parsed.hash];
    }

    protected async loadTarget<Route extends string>(
        target: Answer<Node, Element, WebTagOptions, Route, {}>,
        props: ScreenProps<Route>,
        mode: NavigationMode,
    ): Promise<void> {
        this.$loadingUrl.V = props.path;

        try {
            const { loadingScreen, loadingOverlay } = this.webInit;

            if (mode === "loading-screen" && loadingScreen) {
                this.clearNode(this.contentNode);
                this.build(this.loadingNode, node => loadingScreen({}, node));
            }
            if (mode === "loading-overlay" && loadingOverlay) {
                this.build(this.overlayNode, node => loadingOverlay({}, node));
            }

            await this.renderScreen(target.screen, props, "found");

            this.$currentUrl.V = props.url;
            if (this.location.href !== props.url && this.location.hash !== "#" + props.url) {
                this.window.history.pushState({}, "", props.url);
            }
        } catch (error) {
            if (mode !== "silent") {
                this.clearNode(this.contentNode);
            }
            throw error;
        } finally {
            this.clearLoadings();
            this.$loadingUrl.V = null;
        }
    }

    protected async renderScreen<Props>(
        screen: (props: Props, ctx: Fragment<Node, Element, WebTagOptions>) => void | Promise<void>,
        props: Props,
        scope: RouteRenderScope,
    ): Promise<void> {
        const children = this.contentNode.children;
        const oldChildren = [...children];
        let ctx: Fragment<Node, Element, WebTagOptions> | null = null;

        this.build(this.contentNode, node => (ctx = node));

        /* istanbul ignore else */
        if (ctx) {
            await screen(props, ctx);
        }

        oldChildren.forEach(node => {
            node.destroy(node.sDeep);
        });
        children.splice(0, oldChildren.length);

        if (scope === "not-found") {
            this.window.history.replaceState({}, "", "/");
        }
    }

    protected clearLoadings(): void {
        this.clearNode(this.loadingNode);
        this.clearNode(this.overlayNode);
    }

    protected clearNode(node: Fragment<Node, Element, WebTagOptions>) {
        const { children } = node;

        children.forEach(node => node.destroy(node.sDeep));
        children.splice(0);
    }

    protected build(
        node: Fragment<Node, Element, WebTagOptions>,
        run?: (node: Fragment<Node, Element, WebTagOptions>) => void,
    ) {
        const child = new Fragment<Node, Element, WebTagOptions>(node.runner, node.sDeep + 1);

        node.child(child, run);
    }
}

export function webRouterApp<Routes extends string>(
    node: Element,
    window: Window,
    location: Location,
    init: WebRouterInitialization<Routes>,
) {
    const runner = new WebRunner(window.document);

    return mountApp(
        node,
        (_data, node) => {
            const router = new WebRouter(window, location, node, init);

            Object.defineProperty(runner, "router", {
                value: router,
                writable: false,
            });
        },
        runner,
        {},
    );
}

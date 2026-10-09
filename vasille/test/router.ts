import { Fragment, reportError } from "../src/classes/index.js";
import { IRunner } from "../src/classes/node/runner.js";
import { mount } from "../src/functions/index.js";
import { Answer, QueryParams, Router, RouterInitialization, ScreenProps } from "../src/router/index.js";
import { Runner, TagOptions } from "./runner.js";

export class MockRouter<Routes extends string> extends Router<Node, Element, TagOptions, Routes, object, never[]> {
    public constructor(
        init: RouterInitialization<Node, Element, TagOptions, Routes, object>,
        location: Location,
        private readonly contentNode: Fragment<Node, Element, TagOptions>,
    ) {
        super(init);
        this.doNavigate(location.href, true);
    }

    public goTo(url: string, canNavigate = true): void {
        this.doNavigate(url, canNavigate);
    }

    public load(url: string): Promise<void> {
        return this.prepareNavigation(url, true, true);
    }

    protected doNavigate(url: string, canNavigate: boolean): void {
        this.prepareNavigation(url, canNavigate, false).catch(e => {
            reportError(e);
        });
    }
    protected parseUrl(url: string): [string, QueryParams, string] {
        const parsed = new URL(url, url.startsWith("/") ? "http://localhost:8080/" : undefined);
        const query = [...parsed.searchParams.keys()].reduce((prev, key) => {
            return { ...prev, [key]: parsed.searchParams.getAll(key) };
        }, {} as QueryParams);

        return [parsed.pathname, query, parsed.hash];
    }
    protected async loadTarget<Route extends string>(
        target: Answer<Node, Element, TagOptions, Route, object>,
        props: ScreenProps<Route>,
    ): Promise<void> {
        await this.renderScreen(target.screen, props);
    }
    protected async renderScreen<Props>(
        screen: (
            props: Props,
            ctx: Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        ) => void | Promise<void>,
        props: Props,
    ): Promise<void> {
        const children = this.contentNode.children;
        const oldChildren = [...children];
        const ctx = new Fragment<Node, Element, TagOptions>(this.contentNode.runner, this.contentNode.sDeep + 1);

        this.contentNode.child(ctx, () => {});
        await screen(props, ctx);

        oldChildren.forEach(node => {
            node.destroy(node.sDeep);
        });
        children.splice(0, oldChildren.length);
    }
}

export function routeApp<Routes extends string>(
    node: Element,
    window: Window,
    location: Location,
    init: RouterInitialization<Node, Element, TagOptions, Routes, object>,
) {
    const runner = new Runner(window.document);

    return mount(
        node,
        (_data, node) => {
            const router = new MockRouter<Routes>(init, location, node);

            Object.defineProperty(runner, "router", {
                value: router,
                writable: false,
            });
        },
        runner,
        {},
    );
}

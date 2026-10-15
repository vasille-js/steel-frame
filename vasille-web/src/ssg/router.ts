import { Element, Node, SsgRunner, SsgTagOptions } from "./runner.js";
import { waitForAsyncData } from "./awaited.js";
import { mountStyles } from "./css.js";
import { Fragment, ScreenProps, Answer, QueryParams, Router, RouterInitialization, Routing, AppNode } from "vasille";

export type Mode = "html" | "markdown" | "git-doc";

export class SsgRouter extends Router<Node, Element, SsgTagOptions, string, {}, []> {
    protected readonly runner: SsgRunner;
    protected readonly node: Fragment<Node, Element, SsgTagOptions>;
    public readonly html: boolean;
    public readonly markdown: boolean;

    public constructor(
        runner: SsgRunner,
        node: Fragment<Node, Element, SsgTagOptions>,
        init: RouterInitialization<Node, Element, SsgTagOptions, string, {}>,
        mode: Mode,
    ) {
        super(init);
        this.runner = runner;
        this.node = node;
        this.html = mode === "html" || mode === "git-doc";
        this.markdown = mode === "markdown" || mode === "git-doc";
    }

    public async render() {
        return await this.renderStatic(this.root, "/", {});
    }

    public async renderStatic(
        routing: Routing<Node, Element, SsgTagOptions, string, {}>,
        prefix: string,
        routes: Record<string, string>,
    ) {
        if (routing.self) {
            const forceFile = prefix.endsWith(".html");
            const dirPath = prefix.slice(1);
            const filePath = forceFile ? dirPath : dirPath + "/index.html";

            routes[filePath] = await this.doNavigate(prefix);
        }

        for (const key in routing.static) {
            await this.renderStatic(routing.static[key], `${prefix !== "/" ? prefix + "/" : "/"}${key}`, routes);
        }

        return routes;
    }

    protected async doNavigate(url: string) {
        console.log(`Rendering ${url}...`);

        await this.prepareNavigation(url, true, true);

        if (this.markdown) {
            return this.runner.body.toMarkDown(this.html);
        }

        return (
            ["<!doctype html>", "<html>", this.runner.head.toHTML(1), this.runner.body.toHTML(1), "</html>"].join(
                "\n",
            ) + "\n"
        );
    }

    protected parseUrl(url: string): [string, QueryParams, string] {
        return [url, {}, ""];
    }

    protected async loadTarget<Route extends string>(
        target: Answer<Node, Element, SsgTagOptions, Route, {}>,
        props: ScreenProps<Route>,
    ): Promise<void> {
        this.runner.head.children.splice(0);
        this.runner.body.children.splice(0);
        this.node.children.splice(0);

        await this.renderScreen(target.screen, props);
    }

    protected async renderScreen<Props>(
        screen: (props: Props, ctx: Fragment<Node, Element, SsgTagOptions>) => void | Promise<void>,
        props: Props,
    ): Promise<void> {
        await screen(props, this.node);
        await waitForAsyncData();
        mountStyles(this.runner.head);
    }
}

export function routerApp(init: RouterInitialization<Node, Element, SsgTagOptions, string, {}>, mode: Mode = "html") {
    const head = new Element("head", {});
    const body = new Element("body", {});
    const runner = new SsgRunner(head, body);
    const app = new AppNode(body, runner);
    const fragment = new Fragment<Node, Element, SsgTagOptions>(runner, 1);

    app.child(fragment);
    return new SsgRouter(runner, fragment, init, mode);
}

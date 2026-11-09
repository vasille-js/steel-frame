import { page } from "./page.js";
import { WebRouter, webRouterApp } from "../../../src/vasille-web/web/router/router.js";
import { Fragment, Slot } from "../../../src/vasille/index.js";
import { WebTagOptions } from "../../../src/vasille-web/web/runner/runner.js";

it("initialize router", function (done) {
    const window = page();
    const body = window.document.body;
    let index = 0;
    let screenCalled = 0;
    let initialized = 0;
    let router!: WebRouter<string>;

    webRouterApp(body, window as unknown as Window, window.location, {
        routes: {
            "/": {
                screen: (props, ctx) => {
                    if ("r" in ctx.r && ctx.r.r instanceof WebRouter) {
                        router = ctx.r.r;
                    }
                    screenCalled = ++index;
                    return Promise.resolve();
                },
            },
        },
        initialize(): Promise<void> {
            initialized = ++index;
            return Promise.resolve();
        },
    });

    setTimeout(() => {
        expect(initialized).toBe(1);
        expect(screenCalled).toBe(2);
        router.reload();
        setTimeout(() => {
            expect(initialized).toBe(1);
            expect(screenCalled).toBe(3);
            done();
        });
    });
});

it("router initialization fails", function (done) {
    const window = page();
    const body = window.document.body;
    let screenCalled = 0;
    let initialized = 0;
    let router!: WebRouter<string>;

    webRouterApp(body, window as unknown as Window, window.location, {
        routes: {
            "/": {
                screen: (props, ctx) => {
                    if ("r" in ctx.r && ctx.r.r instanceof WebRouter) {
                        router = ctx.r.r;
                    }
                    screenCalled++;
                    return Promise.resolve();
                },
            },
        },
        initialize(): Promise<void> {
            initialized++;
            throw new Error("test error");
        },
    });

    setTimeout(() => {
        expect(initialized).toBe(1);
        expect(screenCalled).toBe(1);
        router.reload();
        setTimeout(() => {
            expect(initialized).toBe(2);
            expect(screenCalled).toBe(2);
            done();
        });
    });
});

it("router with wrapper", function (done) {
    const window = page();
    const body = window.document.body;
    let router!: WebRouter<string>;

    webRouterApp(body, window as unknown as Window, window.location, {
        routes: {
            "/": {
                screen: (props, ctx) => {
                    ctx.tag("div", { c: ["screen"] });
                    if ("r" in ctx.r && ctx.r.r instanceof WebRouter) {
                        router = ctx.r.r;
                    }
                    return Promise.resolve();
                },
            },
            "/next": {
                screen: (props, ctx) => {
                    ctx.tag("div", { c: ["next"] });
                    return Promise.resolve();
                },
            },
        },
        Wrapper(
            data: { slot(data: object, ctx: Fragment<Node, Element, WebTagOptions>): void },
            ctx: Fragment<Node, Element, WebTagOptions>,
        ) {
            ctx.tag("div", { c: ["wrapper"] }, ctx => {
                Slot({ model: data.slot }, ctx);
            });
        },
    });

    setTimeout(() => {
        expect(body.children.length).toBe(1);
        expect(body.children[0].className).toBe("wrapper");
        expect(body.children[0].children.length).toBe(1);
        expect(body.children[0].children[0].className).toBe("screen");

        router.load("/next");
        setTimeout(() => {
            expect(body.children.length).toBe(1);
            expect(body.children[0].className).toBe("wrapper");
            expect(body.children[0].children.length).toBe(1);
            expect(body.children[0].children[0].className).toBe("next");
            done();
        });
    });
});

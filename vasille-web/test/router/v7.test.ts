import { page } from "./page.js";
import { routeApp, Router } from "../src/web/router.js";
import { Fragment } from "vasille";
import { TagOptions } from "vasille/web-runner";
import { Slot } from "vasille-jsx";

it("initialize router", function (done) {
    const window = page();
    const body = window.document.body;
    let index = 0;
    let screenCalled = 0;
    let initialized = 0;
    let router!: Router<string>;

    routeApp(body, window as unknown as Window, window.location, {
        routes: {
            "/": {
                screen: (props, ctx) => {
                    if ("router" in ctx.runner && ctx.runner.router instanceof Router) {
                        router = ctx.runner.router;
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
    let router!: Router<string>;

    routeApp(body, window as unknown as Window, window.location, {
        routes: {
            "/": {
                screen: (props, ctx) => {
                    if ("router" in ctx.runner && ctx.runner.router instanceof Router) {
                        router = ctx.runner.router;
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
    let router!: Router<string>;

    routeApp(body, window as unknown as Window, window.location, {
        routes: {
            "/": {
                screen: (props, ctx) => {
                    ctx.tag("div", { c: ["screen"] });
                    if ("router" in ctx.runner && ctx.runner.router instanceof Router) {
                        router = ctx.runner.router;
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
        wrapper(
            data: { slot(data: object, ctx: Fragment<Node, Element, TagOptions>): void },
            ctx: Fragment<Node, Element, TagOptions>,
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

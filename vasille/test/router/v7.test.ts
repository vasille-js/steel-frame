import { MockRouter, routeApp } from "../router.js";
import { page } from "./page.js";

it("initialize router", function (done) {
    const window = page();
    const body = window.document.body;
    let index = 0;
    let screenCalled = 0;
    let initialized = 0;
    let router!: MockRouter<string>;

    routeApp(body, window as unknown as Window, window.location, {
        routes: {
            "/": {
                screen: (props, ctx) => {
                    if ("router" in ctx.runner && ctx.runner.router instanceof MockRouter) {
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
        router.goTo("/");
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
    let router!: MockRouter<string>;

    routeApp(body, window as unknown as Window, window.location, {
        routes: {
            "/": {
                screen: (props, ctx) => {
                    if ("router" in ctx.runner && ctx.runner.router instanceof MockRouter) {
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
        router.goTo("/");
        setTimeout(() => {
            expect(initialized).toBe(2);
            expect(screenCalled).toBe(2);
            done();
        });
    });
});

import { page } from "../router/page.ts";
import { routerApp } from "../../src/web/index.ts";

class FakeWindow {
    public readonly window: Window;

    public constructor(window: Window) {
        this.window = window;
    }

    public readonly location = {
        href: "http://localhost:8080/about",
        origin: "http://localhost:8080",
    } as unknown as Location;

    public get document() {
        return this.window.document;
    }

    public addEventListener(...args: any[]) {
        // @ts-expect-error
        this.window.addEventListener(...args);
    }
    public removeEventListener(...args: any[]) {
        // @ts-expect-error
        this.window.removeEventListener(...args);
    }
    public createElement(...args: any[]) {
        // @ts-expect-error
        return this.window.document.createElement(...args);
    }
    public history = {
        pushState() {},
        replaceState() {},
    } as unknown as History;
}

it("exported web router", function (done) {
    const window = page();
    const body = window.document.body;

    // @ts-expect-error
    global.window = new FakeWindow(window as unknown as Window);
    global.document = window.document;

    routerApp({
        fallbackScreen() {},
        errorScreen() {},
        routes: {
            "/about": {
                async screen(props, ctx) {
                    expect(props.path).toBe("/about");
                    ctx.tag("div", {});
                },
            },
        },
    });

    setTimeout(() => {
        expect(body.children.length).toBe(1);
        done();
    }, 1);
});

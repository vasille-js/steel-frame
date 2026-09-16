import { App } from "../../src/index.js";
import { Runner, TagOptions } from "../../src/runner/web/runner.js";
import { page } from "../page.js";

it("handles destroy via callback", function () {
    const window = page();
    const root = new App<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    let destroyed = false;

    root.tag("div", {
        k(element) {
            expect(element.tagName).toBe("DIV");
            return () => {
                destroyed = true;
            };
        },
    });

    root.destroy(0);
    expect(destroyed).toBe(true);
});

it("handles destroy directly", function () {
    const window = page();
    const root = new App<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    let destroyed = false;

    root.tag("div", {
        d() {
            destroyed = true;
        },
    });

    root.destroy(0);
    expect(destroyed).toBe(true);
});

it("handles destroy via both methods", function () {
    const window = page();
    const root = new App<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    let destroyed_via_callback = 0;
    let destroyed_directly = 0;
    let counter = 0;

    root.tag("div", {
        k(element) {
            expect(element.tagName).toBe("DIV");
            return () => {
                destroyed_via_callback = ++counter;
            };
        },
        d() {
            destroyed_directly = ++counter;
        },
    });

    root.destroy(0);
    expect(destroyed_via_callback).toBe(1);
    expect(destroyed_directly).toBe(2);
});

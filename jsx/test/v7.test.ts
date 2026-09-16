import { mount, view } from "../src/index.js";
import { createNode } from "./page.js";

const test = view(function () {
    return { a: 1 };
});

it("handles destroy via callback", function () {
    const [node, window] = createNode();
    const body = window.document.body;
    let destroyed = false;

    const app = mount(body, test, node.runner, {
        callback: $ => {
            expect($.a).toBe(1);
            return () => {
                destroyed = true;
            };
        },
    });

    app.destroy(0);
    expect(destroyed).toBe(true);
});

it("handles destroy via runOnDestroy", function () {
    const [node, window] = createNode();
    const body = window.document.body;
    let destroyed = false;

    const app = mount(body, test, node.runner, {
        runOnDestroy() {
            destroyed = true;
        },
    });

    app.destroy(0);
    expect(destroyed).toBe(true);
});

it("handles destroy via both methods", function () {
    const [node, window] = createNode();
    const body = window.document.body;
    let destroyed_via_callback = 0;
    let destroyed_directly = 0;
    let counter = 0;

    const app = mount(body, test, node.runner, {
        callback: $ => {
            expect($.a).toBe(1);
            return () => {
                destroyed_via_callback = ++counter;
            };
        },
        runOnDestroy() {
            destroyed_directly = ++counter;
        },
    });

    app.destroy(0);
    expect(destroyed_via_callback).toBe(1);
    expect(destroyed_directly).toBe(2);
});

import { page } from "../page.ts";
import { WebTagOptions } from "../../src/web/runner/runner.ts";
import { component, modal, mount } from "../../src/web/index.ts";
import { Slot } from "vasille";

const Modal = modal((node, { slot }) => {
    node.tag("div", { c: ["modal"] }, node => {
        Slot({ model: slot }, node);
    });
});

const Test = component<Node, Element, WebTagOptions, {}, void>(node => {
    node.tag("div", { c: ["test"] }, node => {
        Modal({}, node, (_, node) => {
            node.text("modal");
        });
    });
});

it("creates modal", function () {
    const window = page();
    const body = window.document.body;

    // @ts-expect-error
    global.window = window;
    global.document = window.document;

    mount(body, Test, {});

    expect(body.children.length).toBe(2);
    expect(body.children[0]!.className).toBe("test");
    expect(body.children[1]!.className).toBe("modal");
    expect(body.children[1]!.innerHTML).toBe("modal");
});

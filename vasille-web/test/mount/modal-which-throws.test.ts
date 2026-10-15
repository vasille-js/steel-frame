import { page } from "../page.ts";
import { WebTagOptions } from "../../src/web/runner/runner.ts";
import { component, modal, mount, setErrorHandler } from "../../src/web/index.ts";

const Modal = modal(() => {
    throw new Error("modal");
});

const Test = component<Node, Element, WebTagOptions, {}, void>(node => {
    node.tag("div", { c: ["test"] }, node => {
        Modal({}, node);
    });
});

it("throws error in modal", function () {
    const window = page();
    const body = window.document.body;
    let error: unknown;

    // @ts-expect-error
    global.window = window;
    global.document = window.document;

    setErrorHandler(e => {
        error = e;
    });
    mount(body, Test, {});

    expect(body.children.length).toBe(1);
    expect(body.children[0]!.className).toBe("test");
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("modal");
});

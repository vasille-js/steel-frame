import { page } from "../page.ts";
import { WebTagOptions } from "../../src/web/runner/runner.ts";
import { component, mount, prompt, showPrompt } from "../../src/web/index.ts";

let promise!: Promise<unknown>;

const Prompt = prompt((node, { reject: rj, resolve: rv }) => {
    throw new Error("prompt");
});

const Test = component<Node, Element, WebTagOptions, {}, void>(node => {
    node.tag("div", { c: ["test"] }, node => {
        promise = showPrompt(node, Prompt, {}, 0);
    });
});

it("throw in prompt", function () {
    const window = page();
    const body = window.document.body;

    // @ts-expect-error
    global.window = window;
    global.document = window.document;

    mount(body, Test, {});

    expect(body.children.length).toBe(1);
    expect(body.children[0]!.className).toBe("test");

    expect(promise).toBeInstanceOf(Promise);

    expect(promise).rejects.toEqual(new Error("prompt"));
});

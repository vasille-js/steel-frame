import { page } from "../page.ts";
import { WebTagOptions } from "../../src/web/runner/runner.ts";
import { component, mount, prompt, showPrompt } from "../../src/web/index.ts";

let resolve!: (e: unknown) => void;
let reject!: (e: unknown) => void;
let promise!: Promise<unknown>;

const Prompt = prompt((node, { reject: rj, resolve: rv }) => {
    node.tag("div", { c: ["prompt"] }, node => {
        node.text("prompt");
    });
    resolve = rv;
    reject = rj;
});

const Test = component<Node, Element, WebTagOptions, {}, void>(node => {
    node.tag("div", { c: ["test"] }, node => {
        promise = showPrompt(node, Prompt, {}, 10);
    });
});

it("timeout prompt", function (done) {
    const window = page();
    const body = window.document.body;
    let error: unknown;

    // @ts-expect-error
    global.window = window;
    global.document = window.document;

    mount(body, Test, {});

    expect(body.children.length).toBe(2);
    expect(body.children[0]!.className).toBe("test");
    expect(body.children[1]!.className).toBe("prompt");
    expect(body.children[1]!.innerHTML).toBe("prompt");

    expect(promise).toBeInstanceOf(Promise);
    expect(resolve).toBeDefined();
    expect(reject).toBeDefined();

    // if we don't catch the error, the test will fail because of unhandled rejection
    promise.catch(e => {
        error = e;
    });

    setTimeout(() => {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Timeout");
        done();
    }, 20);
});

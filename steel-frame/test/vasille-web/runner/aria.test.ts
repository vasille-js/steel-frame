import { page } from "../page.js";
import { AppNode, Reference } from "../../../src/vasille/index.js";
import { WebRunner, WebTagOptions } from "../../../src/vasille-web/web/runner/runner.js";

it("Tag", function () {
    const window = page();
    const body = window.document.body;
    const root = new AppNode<Node, Element, WebTagOptions>(body, new WebRunner(window.document));
    const rTrue = new Reference(true);
    const rFalse = new Reference(false);

    root.tag("div", { a: { "aria-hidden": rTrue } });
    root.tag("div", { a: { "aria-hidden": rFalse } });
    root.tag("div", { a: { "aria-hidden": true } });
    root.tag("div", { a: { "aria-hidden": false } });

    expect(body.children.length).toBe(4);
    expect(body.children[0]!.getAttribute("aria-hidden")).toBe("true");
    expect(body.children[1]!.getAttribute("aria-hidden")).toBe("false");
    expect(body.children[2]!.getAttribute("aria-hidden")).toBe("true");
    expect(body.children[3]!.getAttribute("aria-hidden")).toBe("false");

    root.d(0);
});

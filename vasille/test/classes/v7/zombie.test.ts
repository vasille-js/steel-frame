import { AppNode, PortalNode, Reference, ZombieNode } from "../../../src/classes/index.js";
import { Runner, TagOptions } from "../../runner.js";
import { page } from "../page.js";

it("remains alive because it is zombie", function (done) {
    const window = page();
    const body = window.document.body;
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    let triggered = false;

    root.child(
        new ZombieNode<Node, Element, TagOptions>(root.runner, new Reference(1), () => {
            triggered = true;
        }),
        ctx => {
            ctx.tag("div", {});
        },
    );

    expect(body.children.length).toBe(1);
    expect(triggered).toBe(false);
    root.destroy(0);
    expect(body.children.length).toBe(1);
    expect(triggered).toBe(true);

    setTimeout(() => {
        expect(body.children.length).toBe(0);
        done();
    });
});

it("does not remain alive inside a zombie", function () {
    const window = page();
    const body = window.document.body;
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));

    root.tag("div", {}, ctx => {
        ctx.child(new ZombieNode<Node, Element, TagOptions>(root.runner, new Reference(1), () => void 0), ctx => {
            ctx.tag("div", {});
        });
    });

    expect(body.children.length).toBe(1);
    expect(body.children[0]!.children.length).toBe(1);
    root.destroy(1);
    expect(body.children.length).toBe(0);
});

it("remains alive inside a zombie wrapped in portal", function (done) {
    const window = page();
    const body = window.document.body;
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));

    root.tag("div", {}, ctx => {
        ctx.child(new PortalNode<Node, Element, TagOptions>(body, root.runner, 1), ctx => {
            ctx.child(new ZombieNode<Node, Element, TagOptions>(root.runner, new Reference(1), () => void 0), ctx => {
                ctx.tag("div", {});
            });
        });
    });

    expect(body.children.length).toBe(2);
    root.destroy(1);
    expect(body.children.length).toBe(1);

    setTimeout(() => {
        expect(body.children.length).toBe(0);
        done();
    });
});

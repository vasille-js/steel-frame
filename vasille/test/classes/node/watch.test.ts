import { AppNode, Fragment, Reference, WatchNode } from "../../../src/classes/index.js";
import { Runner, TagOptions } from "../../runner.js";
import { page } from "../page.js";

it("Watch Test", function () {
    const model = new Reference(false);
    const window = page();
    const runner = new Runner(window.document);
    const body = window.document.body;
    const root = new AppNode<Node, Element, TagOptions>(body, runner);

    root.child(
        new WatchNode<Node, Element, TagOptions, boolean>(
            {
                model,
                slot: function (node, input) {
                    node.child(new Fragment<Node, Element, TagOptions>(runner, root.sDeep + 1), ctx => {
                        ctx.tag("div", {}, ctx => {
                            ctx.text(input);
                        });
                    });
                },
            },
            runner,
            root.sDeep + 1,
        ),
    );

    root.child(new WatchNode<Node, Element, TagOptions, boolean>({ model }, runner, root.sDeep + 1));

    expect(body.children.length).toBe(1);
    expect(body.children[0]!.innerHTML).toBe("false");
    model.V = true;
    expect(body.children[0]!.innerHTML).toBe("true");
    expect(root.children.length).toBe(2);

    root.destroy(0);

    expect(body.children.length).toBe(0);
});

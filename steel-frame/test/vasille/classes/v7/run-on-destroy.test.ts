import { Runner, TagOptions } from "../../runner.js";
import { page } from "../page.js";
import { AppNode } from "../../../../src/vasille/index.js";

it("handles destroy via callback", function () {
    const window = page();
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    let destroyed = false;

    root.tag("div", {
        slot(node) {
            node.rod(() => {
                destroyed = true;
            });
        },
    });

    root.d(0);
    expect(destroyed).toBe(true);
});

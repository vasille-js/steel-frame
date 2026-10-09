import { AppNode } from "../../../src/classes/index.js";
import { Runner, TagOptions } from "../../runner.js";
import { page } from "../page.js";

it("handles destroy via callback", function () {
    const window = page();
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    let destroyed = false;

    root.tag("div", {
        slot(node) {
            node.runOnDestroy(() => {
                destroyed = true;
            });
        },
    });

    root.destroy(0);
    expect(destroyed).toBe(true);
});

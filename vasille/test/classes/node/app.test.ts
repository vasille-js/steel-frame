import { AppNode, PortalNode } from "../../../src/classes/index.js";
import { Runner, TagOptions } from "../../runner.js";
import { page } from "../page.js";

class MyApp extends AppNode<Node, Element, TagOptions> {
    div!: HTMLDivElement;

    public compose() {
        this.tag("div", { callback: node => (this.div = node as HTMLDivElement) });

        this.child(new PortalNode<Node, Element, TagOptions>(this.div, this.runner, this.sDeep + 1), function (f) {
            f.tag("span", {});
        });
    }
}

it("App", function () {
    const window = page();
    const app = new MyApp(window.document.body, new Runner(window.document));

    app.compose();
    expect(app.div.childElementCount).toBe(1);
    expect(app.children.length).toBe(2);
});

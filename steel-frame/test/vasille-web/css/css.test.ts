import { styleSheet } from "../../../src/vasille-web/web/index.js";
import { AppNode } from "../../../src/vasille/index.js";
import { WebRunner, WebTagOptions } from "../../../src/vasille-web/web/runner/runner.js";
import { page } from "../page.js";

const styles = styleSheet({
    field: ["{}{display: none}"],
});

class MyApp extends AppNode<Node, Element, WebTagOptions> {
    public compose() {
        this.tag("div", {
            c: [styles.field],
        });
    }
}

it("has css stylesheet", function () {
    const window = page();
    const app = new MyApp(window.document.body, new WebRunner(window.document));

    global.document = window.document;
    app.compose();

    expect(window.document.body.children.length).toBe(1);
    expect(window.document.body.children[0]!.className).toBe("vasille-2");
});

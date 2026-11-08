import { styleSheet } from "../../../src/vasille-web/web/index.js";
import { AppNode, IValue, Reference } from "../../../src/vasille/index.js";
import { WebRunner, WebTagOptions } from "../../../src/vasille-web/web/runner/runner.js";
import { page } from "../page.js";

const styles = styleSheet({
    none: ["{}{display: none}"],
    green: ["{}{color: green}"],
});

class MyApp extends AppNode<Node, Element, WebTagOptions> {
    public compose() {
        const cls = new Reference([styles.green, styles.none]);

        this.tag("div", {
            a: {
                class: [styles.none, styles.green] as unknown[] as string[],
            },
        });
        this.tag("div", {
            a: {
                class: cls as IValue<unknown[], unknown> as IValue<string[], unknown>,
            },
        });
    }
}

it("send array to class attr", function () {
    const window = page();
    const app = new MyApp(window.document.body, new WebRunner(window.document));

    global.document = window.document;
    app.compose();

    expect(window.document.body.children.length).toBe(2);
    expect(window.document.body.children[0]!.className).toBe("vasille-2 vasille-3");
    expect(window.document.body.children[1]!.className).toBe("vasille-3 vasille-2");
});

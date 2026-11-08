import { JSDOM } from "jsdom";
import { Runner, TagOptions } from "../runner.js";
import { AppNode, Fragment } from "../../../src/vasille/index.js";

export function createNode() {
    const page = new JSDOM(`
        <html>
            <head>
            </head>
            <body>
            </body>
        </html>
    `);
    const runner = new Runner(page.window.document);
    const node = new Fragment<Node, Element, TagOptions>(runner, 1);

    node.parent = new AppNode<Node, Element, TagOptions>(page.window.document.body, runner);
    global.HTMLElement = page.window.HTMLElement;

    return [node, page.window] as const;
}

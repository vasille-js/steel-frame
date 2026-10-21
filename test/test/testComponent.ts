import { JSDOM } from "jsdom";
import { Composed } from "steel-frame";
import { AppNode, Fragment } from "../../vasille/src";
import { WebRunner } from "../../vasille-web/src/web/runner/runner";

export function testComponent<Out>(
  component: Composed<object, Out>,
): [Out, HTMLBodyElement, AppNode<Node, Element, object>] {
  const page = new JSDOM(
    `
        <html>
            <head>
            </head>
            <body>
            </body>
        </html>
    `,
    { url: "https://localhost:8080" },
  );
  let out: Out;

  global.window = page.window;
  global.document = page.window.document;
  global.location = page.window.location;
  global.HTMLElement = page.window.HTMLElement;

  const runner = new WebRunner(page.window.document);
  const root = new AppNode<Node, Element, object>(page.window.document.body, runner as any);
  const frag = new Fragment<Node, Element, object>(runner as any, 1);

  root.child(frag, function () {
    (component as any)(
      {
        callback: (o: Out) => {
          out = o;
        },
      },
      frag,
    );
  });

  // mount(page.window.document.body, component as any, {
  //   callback: (o: Out) => {
  //     out = o;
  //   },
  // });

  return [out!, page.window.document.body as any, root];
}

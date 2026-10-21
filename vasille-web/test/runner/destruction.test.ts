import { page } from "../page.ts";
import { AppNode, ArrayView, ArrayViewNode, Fragment, Reference } from "vasille";
import { WebRunner, WebTagOptions } from "../../src/web/runner/runner.ts";

it("runs on destroy", function () {
    let callbackDestroy = false;
    let onDestroy = false;
    const window = page();
    const root = new AppNode<Node, Element, WebTagOptions>(window.document.body, new WebRunner(window.document));

    root.tag("button", {
        d: () => {
            onDestroy = true;
        },
        k: () => {
            return () => {
                callbackDestroy = true;
            };
        },
    });

    root.destroy(Infinity);
    expect(onDestroy).toBe(true);
    expect(callbackDestroy).toBe(true);
});

it("destroys text", function () {
    const window = page();
    const body = window.document.body;
    const root = new AppNode<Node, Element, WebTagOptions>(body, new WebRunner(window.document));

    root.text("test");
    expect(body.childNodes.length).toBe(2);

    root.destroy(Infinity);
    expect(body.childNodes.length).toBe(1);
});

it("tag reorder test", function () {
    const window = page();
    const body = window.document.body;
    const runner = new WebRunner(window.document);
    const root = new AppNode<Node, Element, WebTagOptions>(body, runner);
    const arr = new Reference([1, 2, 3]);

    root.child(new Fragment<Node, Element, WebTagOptions>(runner, 1), ctx => {
        ArrayView(
            {
                r_of: arr,
                key: i => i,
                slot: (ctx, item) => {
                    ctx.tag("div", {}, ctx => {
                        ctx.text(item);
                    });
                    ctx.tag("div", {}, ctx => {
                        ctx.text(3 + item.V);
                    });
                },
            },
            ctx,
        );
    });

    expect(body.children.length).toBe(6);
    expect(body.innerHTML.trim()).toBe("<div>1</div><div>4</div><div>2</div><div>5</div><div>3</div><div>6</div>");

    const child1 = body.children[0] as Element;
    const child2 = body.children[2] as Element;
    const child3 = body.children[4] as Element;

    arr.V = [2, 1, 3];

    expect(body.innerHTML.trim()).toBe("<div>2</div><div>5</div><div>1</div><div>4</div><div>3</div><div>6</div>");
    expect(body.children[0]).toBe(child2);
    expect(body.children[2]).toBe(child1);
    expect(body.children[4]).toBe(child3);
});

it("text reorder test", function () {
    const window = page();
    const body = window.document.body;
    const runner = new WebRunner(window.document);
    const root = new AppNode<Node, Element, WebTagOptions>(body, runner);
    const arr = new Reference([1, 2, 3]);

    root.child(new Fragment<Node, Element, WebTagOptions>(runner, 1), ctx => {
        ArrayView(
            {
                r_of: arr,
                key: i => i,
                slot: (ctx, item) => {
                    ctx.text(item);
                    ctx.text(3 + item.V);
                },
            },
            ctx,
        );
    });

    expect(body.childNodes.length).toBe(7);
    expect(body.innerHTML.trim()).toBe("142536");

    const child1 = body.childNodes[1] as Element;
    const child2 = body.childNodes[3] as Element;
    const child3 = body.childNodes[5] as Element;

    arr.V = [2, 1, 3];

    expect(body.innerHTML.trim()).toBe("251436");
    expect(body.childNodes[1]).toBe(child2);
    expect(body.childNodes[3]).toBe(child1);
    expect(body.childNodes[5]).toBe(child3);
});

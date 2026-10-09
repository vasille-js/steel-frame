import { DOMWindow } from "jsdom";
import { Runner, TagOptions } from "../../runner.js";
import { page, TestExpression } from "../page.js";
import { AppNode, Fragment, IValue, Reactive, Reference, SwitchedNode, Tag } from "../../../src/classes/index.js";

let compose = false;

class FragmentTest extends Fragment<Node, Element, object> {
    override compose() {
        super.compose();
        compose = true;
    }
}

it("Fragment", function () {
    const window = page();
    const runner = new Runner(window.document);
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, runner);

    root.child(new FragmentTest(runner, 1));
    expect(root.children.length).toBe(1);
    expect(compose).toBe(true);

    root.destroy(0);
});

it("Tag", function () {
    const window = page();
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    const text = new Reference("test");

    root.tag("div", {}, function (div) {
        div.text(text);
        expect(div.node!.childNodes.length).toBe(1);
        expect(div.node!.innerHTML.trim()).toBe("test");
        text.V = "new";
        expect(div.node!.innerHTML.trim()).toBe("new");

        div.text("test");
        expect(div.node!.childNodes[1] instanceof window.Text).toBe(true);
        expect(div.node!.childNodes[1]!.textContent).toBe("test");

        const textRef = new Reference<string | null, unknown>(null);
        div.text(textRef);
        expect(div.node!.childNodes[2] instanceof window.Text).toBe(true);
        expect(div.node!.childNodes[2]!.textContent).toBe("");
        textRef.V = "ok";
        expect(div.node!.childNodes[2]!.textContent).toBe("ok");
        textRef.V = null;
        expect(div.node!.childNodes[2]!.textContent).toBe("");
    });

    root.destroy(0);
});

it("if", function () {
    const window = page();
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    let check1 = false;
    let check2 = true;

    root.child(
        new SwitchedNode<Node, Element, TagOptions>(root.runner, root.sDeep + 1, [
            {
                $case: new Reference(true),
                slot: (node, value) => {
                    check1 = true;
                    expect(value).toBe(true);
                },
            },
        ]),
    );
    root.child(
        new SwitchedNode<Node, Element, TagOptions>(root.runner, root.sDeep + 1, [
            {
                $case: new Reference(false),
                slot: () => (check2 = false),
            },
        ]),
    );

    expect(check1).toBe(true);
    expect(check2).toBe(true);
    root.destroy(0);
});

it("if else", function () {
    const window = page();
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    const iv1 = new Reference(true);
    const iv2 = new Reference(false);

    let check1 = 1,
        check2 = 1;

    root.child(
        new SwitchedNode<Node, Element, TagOptions>(
            root.runner,
            root.sDeep + 1,
            [{ $case: iv1, slot: () => (check1 = 1) }],
            () => (check1 = 2),
        ),
    );

    root.child(
        new SwitchedNode<Node, Element, TagOptions>(
            root.runner,
            root.sDeep + 1,
            [{ $case: iv2, slot: () => (check2 = 1) }],
            () => (check2 = 2),
        ),
    );

    expect(check1).toBe(1);
    expect(check2).toBe(2);

    iv1.V = false;
    iv2.V = true;

    expect(check1).toBe(2);
    expect(check2).toBe(1);

    root.destroy(0);
});

it("switch", function () {
    const window = page();
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));
    const v = new Reference(1);
    const v2 = new Reference(false);
    let check = 0;

    root.child(
        new SwitchedNode<Node, Element, TagOptions>(
            root.runner,
            root.sDeep + 1,
            [
                { $case: new TestExpression(v => v == 1, [v], root), slot: () => (check = 1) },
                { $case: new TestExpression(v => v == 2, [v], root), slot: () => (check = 2) },
                { $case: new TestExpression(v => v == 3, [v], root), slot: () => (check = 3) },
                { $case: v2, slot: () => (check = -2) },
            ],
            () => (check = 4),
        ),
    );

    v2.V = true;
    expect(check).toBe(1);

    v.V = 2;
    expect(check).toBe(2);

    v.V = 3;
    expect(check).toBe(3);

    v.V = 4;
    v2.V = false;
    expect(check).toBe(4);

    root.destroy(0);
});

it("Error handling", function () {
    const window = page();
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, new Runner(window.document));

    root.tag("div", {}, function (f) {
        // eslint-disable-next-line
        // @ts-ignore
        f.node = null;
        expect(() => f.tag("" as unknown as "a", {})).toThrow("internal-error");
    });
});

function checkSpanAfterDiv(node: Tag<Node, Element, object>, bool: IValue<boolean, unknown>, window: DOMWindow) {
    expect(node.node!.childNodes.length).toBe(2);
    expect(node.node!.childNodes[0]).toBeInstanceOf(window.HTMLDivElement);
    expect(node.node!.childNodes[1]).toBeInstanceOf(window.HTMLSpanElement);

    bool.V = false;
    expect(node.node!.childNodes.length).toBe(1);
    expect(node.node!.childNodes[0]).toBeInstanceOf(window.HTMLSpanElement);

    bool.V = true;
    expect(node.node!.childNodes.length).toBe(2);
    expect(node.node!.childNodes[0]).toBeInstanceOf(window.HTMLDivElement);
    expect(node.node!.childNodes[1]).toBeInstanceOf(window.HTMLSpanElement);
}

it("Insert adjacent", function () {
    const window = page();
    const runner = new Runner(window.document);
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, runner);
    const bool = new Reference(true);

    root.tag("div", {}, function (node) {
        node.child(
            new SwitchedNode<Node, Element, TagOptions>(node.runner, node.sDeep + 1, [
                {
                    $case: bool,
                    slot(node) {
                        node.tag("div", {});
                    },
                },
            ]),
        );
        node.tag("span", {});

        checkSpanAfterDiv(node, bool, window);
    });
});

it("Find first child of tag", function () {
    const window = page();
    const runner = new Runner(window.document);
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, runner);
    const bool = new Reference(true);

    root.tag("div", {}, function (node) {
        node.child(
            new SwitchedNode<Node, Element, TagOptions>(node.runner, node.sDeep + 1, [
                {
                    $case: bool,
                    slot(node) {
                        node.tag("div", {});
                    },
                },
            ]),
        );
        node.child(new Fragment<Node, Element, TagOptions>(runner, node.sDeep + 1), node => {
            node.tag("span", {});
        });

        checkSpanAfterDiv(node, bool, window);
    });
});

it("text", function () {
    const window = page();
    const runner = new Runner(window.document);
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, runner);

    root.tag("div", {}, function (node) {
        node.text("test");
        node.sText(() => "test 2");
        node.sText(() => {
            throw new Error("test");
        });

        expect(node.node!.childNodes.length).toBe(2);
        expect(node.node!.childNodes[0] instanceof window.Text).toBe(true);
        expect(node.node!.childNodes[0]!.textContent).toBe("test");
        expect(node.node!.childNodes[1] instanceof window.Text).toBe(true);
        expect(node.node!.childNodes[1]!.textContent).toBe("test 2");
    });
});

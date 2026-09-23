import { Reactive } from "vasille";
import { debounceRef, edgeRef, expr, mount, ref, toDeepFieldRef, toFieldRef, view, Zombie } from "../src/index.js";
import { abortSignal } from "../src/library.js";
import { createNode } from "./page.js";

const test = view(function () {
    return { a: 1 };
});

it("handles destroy via callback", function () {
    const [node, window] = createNode();
    const body = window.document.body;
    let destroyed = false;

    const app = mount(body, test, node.runner, {
        callback: $ => {
            expect($.a).toBe(1);
            return () => {
                destroyed = true;
            };
        },
    });

    app.destroy(0);
    expect(destroyed).toBe(true);
});

it("handles destroy via runOnDestroy", function () {
    const [node, window] = createNode();
    const body = window.document.body;
    let destroyed = false;

    const app = mount(body, test, node.runner, {
        runOnDestroy() {
            destroyed = true;
        },
    });

    app.destroy(0);
    expect(destroyed).toBe(true);
});

it("handles destroy via both methods", function () {
    const [node, window] = createNode();
    const body = window.document.body;
    let destroyed_via_callback = 0;
    let destroyed_directly = 0;
    let counter = 0;

    const app = mount(body, test, node.runner, {
        callback: $ => {
            expect($.a).toBe(1);
            return () => {
                destroyed_via_callback = ++counter;
            };
        },
        runOnDestroy() {
            destroyed_directly = ++counter;
        },
    });

    app.destroy(0);
    expect(destroyed_via_callback).toBe(1);
    expect(destroyed_directly).toBe(2);
});

it("use abort signal", function () {
    const [node] = createNode();
    const signal = abortSignal(node);

    expect(signal.aborted).toBe(false);
    node.destroy(1);
    expect(signal.aborted).toBe(true);
});

it("use Zombie", function (done) {
    const [node, window] = createNode();
    const body = window.document.body;

    Zombie({ $time: ref(1), trigger() {} }, node, ctx => {
        ctx.tag("div", {});
    });

    expect(body.children.length).toBe(1);
    node.destroy(1);
    expect(body.children.length).toBe(1);

    setTimeout(() => {
        expect(body.children.length).toBe(0);
        done();
    }, 1);
});

it("debounce reference", function (done) {
    const ctx = new Reactive(0);
    const value = ref(0, ctx);
    const debounced = debounceRef(ctx, value, 1);

    value.V = 1;
    expect(debounced.V).toBe(0);
    setTimeout(() => {
        expect(debounced.V).toBe(1);
        done();
    }, 1);
});

it("create field reference", function () {
    const ctx = new Reactive(0);
    const obj = ref<object>({ a: 1 }, ctx);
    const a = toFieldRef(ctx, obj, "a");

    expect(a.V).toBe(1);
    obj.V = { a: 2 };
    expect(a.V).toBe(2);
    obj.V = {};
    expect(a.V).toBeUndefined();
    a.V = 5;
    expect(obj.V).toEqual({ a: 5 });
});

it("create deep field reference", function () {
    const ctx = new Reactive(0);
    const obj = ref<object>({ a: { b: 1 } }, ctx);
    const b = toDeepFieldRef(ctx, obj, ["a", "b"]);

    expect(b.V).toBe(1);
    obj.V = { a: { b: 2 } };
    expect(b.V).toBe(2);
    obj.V = {};
    expect(b.V).toBeUndefined();
    b.V = 5;
    expect(obj.V).toEqual({ a: { b: 5 } });
});

it("create edge reference", function () {
    const ctx = new Reactive(0);
    let external = 0;
    let update: ((v: number) => void) | undefined = undefined;
    const edge = edgeRef(
        ctx,
        () => external,
        v => {
            external = v;
        },
        _update => {
            update = v => {
                external = v;
                _update(v);
            };

            return () => {
                update = undefined;
            };
        },
    );
    const derived = expr(ctx, x => x + 1, [edge]);

    expect(derived.V).toBe(1);
    update!(1);
    expect(derived.V).toBe(2);
    edge.V = 3;
    expect(edge.V).toBe(3);
    expect(derived.V).toBe(4);
    ctx.destroy(1);
    expect(update).toBeUndefined();
});

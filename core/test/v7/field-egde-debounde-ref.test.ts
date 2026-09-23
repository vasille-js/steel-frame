import {
    DebounceReference,
    DeepFieldReference,
    EdgeReference,
    Reactive,
    Reference,
    SingleFieldReference,
} from "../../src/index.js";

it("test field reference", function () {
    const ctx = new Reactive(0);
    const obj = new Reference<object, unknown>({});
    const field = new SingleFieldReference(v => new Reference(v), obj, "test", ctx);

    expect(field.V).toBeUndefined();
    obj.V = { test: 22 };
    expect(field.V).toBe(22);
    obj.V = { test: 33, test2: 22 };
    expect(field.V).toBe(33);
    field.V = 25;
    expect(obj.V).toEqual({ test: 25, test2: 22 });
    obj.V = {};
    expect(field.V).toBeUndefined();
    field.up(24);
    expect(obj.V).toEqual({ test: 24 });
    field.V = 25;
    expect(obj.V).toEqual({ test: 25 });
    field.destroy();
});

it("test field reference of undefined", function () {
    const ctx = new Reactive(0);
    const obj = new Reference<object | undefined, unknown>(undefined);
    const field = new SingleFieldReference(v => new Reference(v), obj, "test", ctx);

    expect(field.V).toBeUndefined();
    field.V = 24;
    expect(obj.V).toEqual({ test: 24 });
    field.destroy();
});

it("test field reference with dependency", function () {
    const ctx = new Reactive(0);
    const obj = new Reference<object, unknown>({});
    const fieldName = new Reference("test");
    const field = new SingleFieldReference(v => new Reference(v), obj, fieldName, ctx);

    expect(field.V).toBeUndefined();
    obj.V = { test: 22 };
    expect(field.V).toBe(22);
    obj.V = { test: 33, test2: 22 };
    expect(field.V).toBe(33);
    fieldName.V = "test2";
    expect(field.V).toBe(22);
    field.V = 25;
    expect(obj.V).toEqual({ test2: 25, test: 33 });
    field.destroy();
    fieldName.V = "test3";
    expect(field.V).toBe(25);
});

it("test deep field reference", function () {
    const ctx = new Reactive(0);
    const obj = new Reference<object, unknown>({ test: { test2: 22 } });
    const field = new DeepFieldReference(v => new Reference(v), obj, ["test", "test2"], ctx);

    expect(field.V).toBe(22);
    obj.V = { test: { test2: 33, test3: 22 }, test4: 44 };
    expect(field.V).toBe(33);
    field.V = 25;
    expect(obj.V).toEqual({ test: { test2: 25, test3: 22 }, test4: 44 });
    obj.V = {};
    expect(field.V).toBeUndefined();
    field.destroy();
});

it("test deep field reference of undefined", function () {
    const ctx = new Reactive(0);
    const obj = new Reference<object | undefined, unknown>(undefined);
    const field = new DeepFieldReference(v => new Reference(v), obj, ["test", "test2"], ctx);

    expect(field.V).toBeUndefined();
    field.up(24);
    expect(obj.V).toEqual({ test: { test2: 24 } });
    field.destroy();
});

it("test deep field reference destroy", function () {
    const ctx = new Reactive(0);
    const obj = new Reference<object | undefined, unknown>(undefined);
    const field = new DeepFieldReference(v => new Reference(v), obj, ["test", "test2"], ctx);

    expect(field.V).toBeUndefined();
    field.destroy();
    field.V = 24;
    expect(field.V).toBeUndefined();
});

it("test deep field reference context destroy", function () {
    const ctx0 = new Reactive(0);
    const ctx1 = new Reactive(1);
    const obj = new Reference<object | undefined, unknown>(undefined, ctx0);
    const field = new DeepFieldReference(v => new Reference(v), obj, ["test", "test2"], ctx1);

    expect(field.V).toBeUndefined();
    ctx1.destroy(1);
    field.V = 24;
    expect(field.V).toBeUndefined();
});

it("test deep filed reference with dependencies", function () {
    const ctx = new Reactive(0);
    const obj = new Reference<object, unknown>({});
    const f1 = new Reference("a");
    const f2 = new Reference("1");
    const field = new DeepFieldReference(v => new Reference(v), obj, [f1, "z", f2], ctx);

    expect(field.V).toBeUndefined();
    field.V = 25;
    expect(obj.V).toEqual({ a: { z: { 1: 25 } } });
    f1.V = "b";
    expect(field.V).toBeUndefined();
    field.V = 26;
    expect(obj.V).toEqual({ a: { z: { 1: 25 } }, b: { z: { 1: 26 } } });
    f2.V = "2";
    expect(field.V).toBeUndefined();
    field.V = 27;
    expect(obj.V).toEqual({ a: { z: { 1: 25 } }, b: { z: { 1: 26, 2: 27 } } });
    field.destroy();
    f1.V = "c";
    f2.V = "3";
    expect(field.V).toBe(27);
});

it("test reactivity edge ref", function () {
    let test = false;
    const edge = new EdgeReference(
        v => new Reference(v),
        () => test,
        value => (test = value),
    );

    expect(test).toBe(false);
    edge.V = true;
    expect(test).toBe(true);
});

it("test reactivity edge ref with subscriber", function () {
    const ctx = new Reactive(0);
    let test = false;
    let update: ((v: boolean) => void) | null = null;
    const edge = new EdgeReference(
        v => new Reference(v),
        () => test,
        value => (test = value),
        ctx,
        setter => {
            update = v => {
                setter(v);
                test = v;
            };
            return () => {
                update = null;
            };
        },
    );

    expect(test).toBe(false);
    (update as ((v: boolean) => void) | null)?.(true);
    expect(test).toBe(true);
    expect(edge.V).toBe(true);
    edge.up(false);
    expect(test).toBe(false);
    ctx.destroy(0);
    expect(update).toBeNull();
});

it("test reference debounce update", function (done) {
    const ctx = new Reactive(0);
    const ref = new Reference(0);
    const debounce = new DebounceReference(v => new Reference(v), ref, 1, ctx);

    expect(debounce.V).toBe(0);
    ref.V = 1;
    expect(debounce.V).toBe(0);
    setTimeout(() => {
        expect(debounce.V).toBe(1);
        done();
    }, 1);
});

it("test reference debounce update via debounce ref", function (done) {
    const ctx = new Reactive(0);
    const ref = new Reference(0);
    const debounce = new DebounceReference(v => new Reference(v), ref, 1, ctx);

    expect(debounce.V).toBe(0);
    debounce.V = 1;
    expect(debounce.V).toBe(0);
    setTimeout(() => {
        expect(debounce.V).toBe(1);
        done();
    }, 1);
});

it("test reference debounce update via debounce ref (up)", function (done) {
    const ctx = new Reactive(0);
    const ref = new Reference(0);
    const debounce = new DebounceReference(v => new Reference(v), ref, 1, ctx);

    expect(debounce.V).toBe(0);
    debounce.up(1);
    expect(debounce.V).toBe(0);
    setTimeout(() => {
        expect(debounce.V).toBe(1);
        done();
    }, 1);
});

it("test reference debounce destroy", function (done) {
    const ctx = new Reactive(0);
    const ref = new Reference(0);
    const debounce = new DebounceReference(v => new Reference(v), ref, 1, ctx);

    expect(debounce.V).toBe(0);
    ref.V = 1;
    expect(debounce.V).toBe(0);
    debounce.destroy();
    setTimeout(() => {
        expect(debounce.V).toBe(0);
        done();
    }, 1);
});

it("test reference debounce context destroy", function (done) {
    const ctx0 = new Reactive(0);
    const ctx1 = new Reactive(1);
    const ref = new Reference(0, ctx0);
    const debounce = new DebounceReference(v => new Reference(v), ref, 1, ctx1);

    expect(debounce.V).toBe(0);
    ref.V = 1;
    expect(debounce.V).toBe(0);
    ctx1.destroy(1);
    setTimeout(() => {
        expect(debounce.V).toBe(0);
        done();
    }, 1);
});

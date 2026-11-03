import { WritableIValue } from "../../src/classes/core/ivalue.js";
import {
    ArrayModel,
    arrayModel,
    ArrayModelViewNode,
    ArrayViewNode,
    expr,
    Fragment,
    MapModel,
    mapModel,
    MapViewNode,
    Reactive,
    ref,
    toDeepFieldRef,
    toFieldRef,
} from "../../src/index.js";
import { createNode } from "../functions/page.js";

it("checks if value is writable", function () {
    const ctx = new Reactive(0);
    const r = ref(0);
    const e = expr(ctx, v => v, [r]);
    const o = ref({});
    const f1 = toFieldRef(ctx, o, "x");
    const f2 = toDeepFieldRef(ctx, o, ["x", "y"]);

    expect(r.isWritable()).toBe(true);
    expect(e.isWritable()).toBe(false);
    expect(f1.isWritable()).toBe(true);
    expect(f2.isWritable()).toBe(true);
});

it("assign undefined to reactive array", function () {
    const array = ref<string[] | undefined>([]);
    const model = arrayModel(undefined, array);

    model.push("str");
    expect(model.array).toEqual(["str"]);

    array.V = undefined;
    expect(model.array).toEqual([]);
});

it("edit array item", function () {
    const array = ref<number[]>([1, 2]);
    // const model = arrayModel(undefined, array);
    const [node] = createNode();
    let number!: WritableIValue<number, unknown>;

    node.child(
        new ArrayViewNode(
            node.runner,
            0,
            array,
            v => v,
            (ctx, value) => {
                if (value.isWritable()) {
                    number = value;
                }
            },
            true,
            ref,
            ref,
            r => new Fragment(r, 1),
        ),
    );

    expect(number.V).toBe(2);

    number.V = 3;
    expect(array.V).toEqual([1, 3]);
});

it("edit array model item", function () {
    const array = arrayModel(undefined, [1, 2]) as ArrayModel<number, unknown>;
    const [node] = createNode();
    let number!: WritableIValue<number, unknown>;

    node.child(
        new ArrayModelViewNode(
            node.runner,
            0,
            array,
            (ctx, value: WritableIValue<number, unknown>) => {
                if (value.isWritable()) {
                    number = value;
                }
            },
            true,
            ref,
            r => new Fragment(r, 1),
        ),
    );

    expect(number.V).toBe(1);

    number.V = 3;
    expect(array.array).toEqual([3, 2]);
});

it("edit map model item", function () {
    const map = mapModel(undefined, [
        [1, 1],
        [2, 2],
    ]) as MapModel<number, number, unknown>;
    const [node] = createNode();
    let number!: WritableIValue<number, unknown>;

    node.child(
        new MapViewNode(
            node.runner,
            0,
            map,
            (ctx, value: WritableIValue<number, unknown>) => {
                if (value.isWritable()) {
                    number = value;
                }
            },
            true,
            ref,
            r => new Fragment(r, 1),
        ),
    );

    expect(number.V).toBe(2);

    number.V = 3;
    expect([...map.map]).toEqual([
        [1, 1],
        [2, 3],
    ]);
});

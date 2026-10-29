import { arrayModel, ArrayModelView, mapModel, MapModelView, ref, setModel, SetModelView } from "../../src/index.js";
import { createNode } from "../functions/page.js";

it("initialize size", function () {
    const arrLength = ref(0);
    const mapSize = ref(0);
    const setSize = ref(0);
    const arr = arrayModel(undefined, [1, 2, 3], arrLength);
    const map = mapModel(
        undefined,
        [
            [1, 1],
            [2, 2],
            [3, 3],
        ],
        mapSize,
    );
    const set = setModel(undefined, [1, 2, 3], setSize);

    expect(arr.array.length).toBe(3);
    expect(arrLength.V).toBe(3);
    expect(map.map.size).toBe(3);
    expect(mapSize.V).toBe(3);
    expect(set.set.size).toBe(3);
    expect(setSize.V).toBe(3);
});

it("resets collection after destruction", function () {
    const $arr = ref([1, 2, 3]);
    const $map = ref<[number, number][]>([
        [1, 1],
        [2, 2],
        [3, 3],
    ]);
    const $set = ref([1, 2, 3, 1]);
    const arr = arrayModel(undefined, $arr);
    const map = mapModel(undefined, $map);
    const set = setModel(undefined, $set);

    $arr.V = [1, 2];
    expect(arr.array.length).toBe(2);
    expect(arr.array).toEqual([1, 2]);

    $set.V = [1, 2];
    expect(set.set.size).toBe(2);
    expect([...set.set]).toEqual([1, 2]);

    $map.V = [
        [1, 1],
        [2, 2],
    ];
    expect(map.map.size).toBe(2);
    expect([...map.map]).toEqual([
        [1, 1],
        [2, 2],
    ]);

    arr.destroy(Infinity);
    map.destroy(Infinity);
    set.destroy(Infinity);

    $arr.V = [];
    expect(arr.array).toEqual([1, 2]);

    $set.V = [];
    expect([...set.set]).toEqual([1, 2]);

    $map.V = [];
    expect([...map.map]).toEqual([
        [1, 1],
        [2, 2],
    ]);
});

it("resets collection having html bindings", function () {
    const $arr = ref([1, 2, 3]);
    const $map = ref<[number, number][]>([
        [1, 1],
        [2, 2],
        [3, 3],
    ]);
    const $set = ref([1, 2, 3, 1]);
    const arr = arrayModel(undefined, $arr);
    const map = mapModel(undefined, $map);
    const set = setModel(undefined, $set);
    const [node, window] = createNode();
    const body = window.document.body;

    node.tag("div", {}, ctx => {
        ArrayModelView(
            {
                writable: false,
                of: arr,
                slot(ctx, value) {
                    ctx.text(value);
                },
            },
            ctx,
        );
    });
    node.tag("div", {}, ctx => {
        MapModelView(
            {
                writable: false,
                of: map,
                slot(ctx, value) {
                    ctx.text(value);
                },
            },
            ctx,
        );
    });
    node.tag("div", {}, ctx => {
        SetModelView(
            {
                of: set,
                slot(ctx, value) {
                    ctx.text(value);
                },
            },
            ctx,
        );
    });

    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("123");
    expect(body.children[1].innerHTML).toBe("123");
    expect(body.children[2].innerHTML).toBe("123");

    $arr.V = [1, 2];
    expect(body.children[0].innerHTML).toBe("12");

    $set.V = [1, 2];
    expect(body.children[2].innerHTML).toBe("12");

    $map.V = [
        [1, 1],
        [2, 2],
    ];
    expect(body.children[1].innerHTML).toBe("12");
});

import { ArrayModel, Listener, MapModel, Reference, SetModel } from "../../../src/classes/index.js";
import { ensure } from "../../../src/index.js";

it("listener", function () {
    const listener = new Listener<[number, number]>();
    let addCounter = 0;
    const addHandler = (i: number, v: number) => {
        addCounter = i + v;
    };

    listener.on(addHandler);

    listener.emit(1, 1);
    expect(addCounter).toBe(2);

    listener.off(addHandler);
    listener.emit(1, 2);

    expect(addCounter).toBe(2);
});

it("array model", function () {
    const length = new Reference(0);
    const array = new ArrayModel<number, unknown>([1, 2, 3], undefined, length);

    expect(array.array.at(0)).toBe(1);

    expect(array.pop()).toBe(3);
    expect(array.array).toEqual([1, 2]);

    expect(array.push(1, 2, 3)).toBe(5);
    expect(array.array).toEqual([1, 2, 1, 2, 3]);

    expect(array.shift()).toBe(1);
    expect(array.array).toEqual([2, 1, 2, 3]);

    expect(array.splice(1, 2, 2, 1)).toEqual([1, 2]);
    expect(array.array).toEqual([2, 2, 1, 3]);
    expect(array.splice(3)).toEqual([3]);
    expect(array.array).toEqual([2, 2, 1]);

    expect(array.unshift(3)).toBe(4);
    expect(array.array).toEqual([3, 2, 2, 1]);

    array.push(4);
    expect(array.array).toEqual([3, 2, 2, 1, 4]);

    array.splice(1, 0, -1);
    expect(array.array).toEqual([3, -1, 2, 2, 1, 4]);

    array.unshift(-4);
    expect(array.array).toEqual([-4, 3, -1, 2, 2, 1, 4]);

    array.splice(0, 1);
    expect(array.array).toEqual([3, -1, 2, 2, 1, 4]);

    array.splice(length.V - 1, 1);
    expect(array.array).toEqual([3, -1, 2, 2, 1]);

    array.splice(2, 1);
    expect(array.array).toEqual([3, -1, 2, 1]);

    array.splice(array.array.indexOf(-1), 1);
    expect(array.array).toEqual([3, 2, 1]);

    array.sort();
    expect(array.array).toEqual([1, 2, 3]);

    array.replace(1, 4);
    expect(array.array).toEqual([1, 4, 3]);

    expect(length.V).toBe(3);

    array.splice(0);
    expect(array.array).toEqual([]);

    expect(length.V).toBe(0);
});

it("map model", function () {
    const map = new MapModel<number, number, unknown>([
        [1, 2],
        [2, 3],
        [3, 4],
    ]);

    expect(map.map.get(1)).toBe(2);

    map.delete(3);
    expect(Array.from(map.map)).toEqual([
        [1, 2],
        [2, 3],
    ]);

    map.set(2, 4);
    expect(Array.from(map.map)).toEqual([
        [1, 2],
        [2, 4],
    ]);

    map.clear();
    expect(Array.from(map.map)).toEqual([]);
});

it("set model", function () {
    const set = new SetModel<number, unknown>([1, 2, 3]);

    set.add(4);
    expect(Array.from(set.set)).toEqual([1, 2, 3, 4]);

    set.delete(4);
    expect(Array.from(set.set)).toEqual([1, 2, 3]);

    set.delete(2);
    expect(Array.from(set.set)).toEqual([1, 3]);

    set.clear();
    expect(Array.from(set.set)).toEqual([]);
});

it("has reactive array inside", function () {
    const array = new Reference([0, 0, 0] as number[]);
    const length = new Reference(0);
    const model = new ArrayModel<number, unknown>(array, undefined, length);

    expect(length.V).toBe(3);
    expect(array.V).toEqual([0, 0, 0]);

    expect(model.pop()).toBe(0);
    expect(array.V).toEqual([0, 0]);

    expect(model.push(1, 2, 3)).toBe(5);
    expect(array.V).toEqual([0, 0, 1, 2, 3]);

    expect(model.shift()).toBe(0);
    expect(array.V).toEqual([0, 1, 2, 3]);

    expect(model.splice(1, 2, 2, 1)).toEqual([1, 2]);
    expect(array.V).toEqual([0, 2, 1, 3]);
    expect(model.splice(3)).toEqual([3]);
    expect(array.V).toEqual([0, 2, 1]);

    expect(model.unshift(3)).toBe(4);
    expect(array.V).toEqual([3, 0, 2, 1]);

    model.push(4);
    expect(array.V).toEqual([3, 0, 2, 1, 4]);

    model.splice(1, 0, -1);
    expect(array.V).toEqual([3, -1, 0, 2, 1, 4]);

    model.unshift(-4);
    expect(array.V).toEqual([-4, 3, -1, 0, 2, 1, 4]);

    model.splice(0, 1);
    expect(array.V).toEqual([3, -1, 0, 2, 1, 4]);

    model.splice(length.V - 1, 1);
    expect(array.V).toEqual([3, -1, 0, 2, 1]);

    model.splice(2, 1);
    expect(array.V).toEqual([3, -1, 2, 1]);

    model.splice(model.array.indexOf(-1), 1);
    expect(array.V).toEqual([3, 2, 1]);

    model.sort();
    expect(array.V).toEqual([1, 2, 3]);

    model.replace(1, 4);
    expect(array.V).toEqual([1, 4, 3]);

    model.splice(0);
    expect(array.V).toEqual([]);
});

it("has reactive map inside", function () {
    const map = new Reference(new Map<number, number>());
    const size = new Reference(0);
    const model = new MapModel<number, number, unknown>(map, undefined, size);

    expect(size.V).toBe(0);

    model.set(1, 2);
    model.set(2, 3);
    model.set(3, 4);
    expect(size.V).toBe(3);

    expect(map.V.get(1)).toBe(2);

    model.delete(3);
    expect(Array.from(map.V)).toEqual([
        [1, 2],
        [2, 3],
    ]);

    model.set(2, 4);
    expect(Array.from(map.V)).toEqual([
        [1, 2],
        [2, 4],
    ]);

    model.clear();
    expect(Array.from(map.V)).toEqual([]);
});

it("has reactive set inside", function () {
    const set = new Reference(new Set<number>());
    const size = new Reference(0);
    const model = new SetModel<number, unknown>(set, undefined, size);

    expect(size.V).toBe(0);

    model.add(1);
    model.add(2);
    model.add(3);
    expect(size.V).toBe(3);

    model.add(4);
    expect(Array.from(set.V)).toEqual([1, 2, 3, 4]);

    model.delete(4);
    expect(Array.from(set.V)).toEqual([1, 2, 3]);

    model.delete(2);
    expect(Array.from(set.V)).toEqual([1, 3]);

    model.clear();
    expect(Array.from(set.V)).toEqual([]);
});

it("has reactive map as array inside", function () {
    const array = new Reference([] as [number, number][]);
    const size = new Reference(0);
    const model = new MapModel<number, number, unknown>(array, undefined, size);

    model.set(1, 2);
    model.set(2, 3);
    model.set(3, 4);
    expect(size.V).toBe(3);

    expect(array.V[0]).toEqual([1, 2]);

    model.delete(3);
    expect(array.V).toEqual([
        [1, 2],
        [2, 3],
    ]);

    model.set(2, 4);
    expect(array.V).toEqual([
        [1, 2],
        [2, 4],
    ]);

    model.clear();
    expect(array.V).toEqual([]);
});

it("has reactive set as array inside", function () {
    const array = new Reference([] as number[]);
    const size = new Reference(0);
    const model = new SetModel<number, unknown>(array, undefined, size);

    model.add(1);
    model.add(2);
    model.add(3);
    expect(size.V).toBe(3);

    model.add(4);
    expect(array.V).toEqual([1, 2, 3, 4]);

    model.delete(4);
    expect(array.V).toEqual([1, 2, 3]);

    model.delete(2);
    expect(array.V).toEqual([1, 3]);

    model.clear();
    expect(array.V).toEqual([]);
});

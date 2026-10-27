import { ArrayModel, Listener, MapModel, SetModel } from "../../../src/classes/index.js";
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
    const array = new ArrayModel<number>([1, 2, 3]);

    expect(array.array.at(0)).toBe(1);

    array.fill(0);
    expect(array.array).toEqual([0, 0, 0]);

    array.fill(1, 1, -1);
    expect(array.array).toEqual([0, 1, 0]);

    array.fill(2, 2, 0);
    expect(array.array).toEqual([0, 1, 0]);

    array.fill(0, -5, 5);
    expect(array.array).toEqual([0, 0, 0]);

    expect(array.pop()).toBe(0);
    expect(array.array).toEqual([0, 0]);

    expect(array.push(1, 2, 3)).toBe(5);
    expect(array.array).toEqual([0, 0, 1, 2, 3]);

    expect(array.shift()).toBe(0);
    expect(array.array).toEqual([0, 1, 2, 3]);

    expect(array.splice(1, 2, 2, 1)).toEqual([1, 2]);
    expect(array.array).toEqual([0, 2, 1, 3]);
    expect(array.splice(3)).toEqual([3]);
    expect(array.array).toEqual([0, 2, 1]);

    expect(array.unshift(3)).toBe(4);
    expect(array.array).toEqual([3, 0, 2, 1]);

    array.push(4);
    expect(array.array).toEqual([3, 0, 2, 1, 4]);

    array.splice(1, 0, -1);
    expect(array.array).toEqual([3, -1, 0, 2, 1, 4]);

    array.unshift(-4);
    expect(array.array).toEqual([-4, 3, -1, 0, 2, 1, 4]);

    array.splice(0, 1);
    expect(array.array).toEqual([3, -1, 0, 2, 1, 4]);

    array.splice(array.length - 1, 1);
    expect(array.array).toEqual([3, -1, 0, 2, 1]);

    array.splice(2, 1);
    expect(array.array).toEqual([3, -1, 2, 1]);

    array.splice(array.array.indexOf(-1), 1);
    expect(array.array).toEqual([3, 2, 1]);

    array.sort();
    expect(array.array).toEqual([1, 2, 3]);

    array.replace(1, 4);
    expect(array.array).toEqual([1, 4, 3]);

    array.copyWithin(1, 0);
    expect(array.array).toEqual([1, 1, 4]);

    array.splice(0);
    expect(array.array).toEqual([]);

    expect(array.length).toBe(0);

    array.length = 2;
    expect(array.length).toBe(2);
    expect(array.array[0]).toBe(undefined);
});

it("map model", function () {
    const map = new MapModel<number, number>([
        [1, 2],
        [2, 3],
        [3, 4],
    ]);

    expect(map.get(1)).toBe(2);

    map.delete(3);
    expect(Array.from(map)).toEqual([
        [1, 2],
        [2, 3],
    ]);

    map.set(2, 4);
    expect(Array.from(map)).toEqual([
        [1, 2],
        [2, 4],
    ]);

    map.clear();
    expect(Array.from(map)).toEqual([]);
});

it("set model", function () {
    const set = new SetModel<number>([1, 2, 3]);

    set.add(4);
    expect(Array.from(set)).toEqual([1, 2, 3, 4]);

    set.delete(4);
    expect(Array.from(set)).toEqual([1, 2, 3]);

    set.delete(2);
    expect(Array.from(set)).toEqual([1, 3]);

    set.clear();
    expect(Array.from(set)).toEqual([]);
});

it("has reactive array inside", function () {
    const array = new ArrayModel<number>();

    expect("r_length" in array).toBe(true);
    expect("r_array" in array).toBe(true);

    expect(ensure(undefined, array, "r_length").V).toBe(0);
    expect(array.r_length.V).toBe(0);

    array.length = 3;
    expect(array.r_length.V).toBe(3);

    array.fill(0);
    expect(array.r_array.V).toEqual([0, 0, 0]);

    array.fill(1, 1, -1);
    expect(array.r_array.V).toEqual([0, 1, 0]);

    array.fill(2, 2, 0);
    expect(array.r_array.V).toEqual([0, 1, 0]);

    array.fill(0, -5, 5);
    expect(array.r_array.V).toEqual([0, 0, 0]);

    expect(array.pop()).toBe(0);
    expect(array.r_array.V).toEqual([0, 0]);

    expect(array.push(1, 2, 3)).toBe(5);
    expect(array.r_array.V).toEqual([0, 0, 1, 2, 3]);

    expect(array.shift()).toBe(0);
    expect(array.r_array.V).toEqual([0, 1, 2, 3]);

    expect(array.splice(1, 2, 2, 1)).toEqual([1, 2]);
    expect(array.r_array.V).toEqual([0, 2, 1, 3]);
    expect(array.splice(3)).toEqual([3]);
    expect(array.r_array.V).toEqual([0, 2, 1]);

    expect(array.unshift(3)).toBe(4);
    expect(array.r_array.V).toEqual([3, 0, 2, 1]);

    array.push(4);
    expect(array.r_array.V).toEqual([3, 0, 2, 1, 4]);

    array.splice(1, 0, -1);
    expect(array.r_array.V).toEqual([3, -1, 0, 2, 1, 4]);

    array.unshift(-4);
    expect(array.r_array.V).toEqual([-4, 3, -1, 0, 2, 1, 4]);

    array.splice(0, 1);
    expect(array.r_array.V).toEqual([3, -1, 0, 2, 1, 4]);

    array.splice(array.length - 1, 1);
    expect(array.r_array.V).toEqual([3, -1, 0, 2, 1]);

    array.splice(2, 1);
    expect(array.r_array.V).toEqual([3, -1, 2, 1]);

    array.splice(array.array.indexOf(-1), 1);
    expect(array.r_array.V).toEqual([3, 2, 1]);

    array.sort();
    expect(array.r_array.V).toEqual([1, 2, 3]);

    array.replace(1, 4);
    expect(array.r_array.V).toEqual([1, 4, 3]);

    array.copyWithin(1, 0);
    expect(array.r_array.V).toEqual([1, 1, 4]);

    array.splice(0);
    expect(array.r_array.V).toEqual([]);
});

it("has reactive map inside", function () {
    const map = new MapModel<number, number>();

    expect("r_size" in map).toBe(true);
    expect("r_array" in map).toBe(true);
    expect("r_map" in map).toBe(true);

    expect(ensure(undefined, map, "r_size").V).toBe(0);
    expect(map.r_size.V).toBe(0);

    map.set(1, 2);
    map.set(2, 3);
    map.set(3, 4);
    expect(map.r_size.V).toBe(3);

    expect(map.get(1)).toBe(2);

    map.delete(3);
    expect(Array.from(map.r_map.V)).toEqual([
        [1, 2],
        [2, 3],
    ]);

    map.set(2, 4);
    expect(Array.from(map.r_map.V)).toEqual([
        [1, 2],
        [2, 4],
    ]);

    map.clear();
    expect(Array.from(map.r_map.V)).toEqual([]);
});

it("has reactive set inside", function () {
    const set = new SetModel<number>();

    expect("r_size" in set).toBe(true);
    expect("r_array" in set).toBe(true);
    expect("r_set" in set).toBe(true);

    expect(ensure(undefined, set, "r_size").V).toBe(0);
    expect(set.r_size.V).toBe(0);

    set.add(1);
    set.add(2);
    set.add(3);
    expect(set.r_size.V).toBe(3);

    set.add(4);
    expect(Array.from(set.r_set.V)).toEqual([1, 2, 3, 4]);

    set.delete(4);
    expect(Array.from(set.r_set.V)).toEqual([1, 2, 3]);

    set.delete(2);
    expect(Array.from(set.r_set.V)).toEqual([1, 3]);

    set.clear();
    expect(Array.from(set.r_set.V)).toEqual([]);
});

import { testComponent } from "../testComponent.js";
import { arrayModel, component, mapModel, setModel } from "steel-frame";

it("array model writes to reactive", function () {
    const [control] = testComponent(
        component(() => {
            let wr_arr = [1, 2];
            const model = arrayModel(wr_arr);

            return {
                r_arr: wr_arr,
                model: model,
            };
        }),
    );

    expect(control.r_arr).toEqual([1, 2]);

    control.model.push(3);
    expect(control.r_arr).toEqual([1, 2, 3]);
});

it("set model writes to reactive array", function () {
    const [control] = testComponent(
        component(() => {
            let wr_arr = [1, 2];
            const model = setModel(wr_arr);

            return {
                r_arr: wr_arr,
                model: model,
            };
        }),
    );

    expect(control.r_arr).toEqual([1, 2]);

    control.model.add(3);
    expect(control.r_arr).toBeInstanceOf(Array);
    expect(control.r_arr).toEqual([1, 2, 3]);
});

it("set model writes to reactive set", function () {
    const [control] = testComponent(
        component(() => {
            let wr_set = new Set([1, 2]);
            const model = setModel(wr_set);

            return {
                r_set: wr_set,
                model: model,
            };
        }),
    );

    expect([...control.r_set]).toEqual([1, 2]);

    control.model.add(3);
    expect(control.r_set).toBeInstanceOf(Set);
    expect([...control.r_set]).toEqual([1, 2, 3]);
});

it("map model writes to reactive array", function () {
    const [{ model, r_arr }] = testComponent(
        component(() => {
            let wr_arr: [number, string][] = [
                [1, "1"],
                [2, "2"],
            ];
            const model = mapModel(wr_arr);
            return {
                r_arr: wr_arr,
                model: model,
            };
        }),
    );

    expect(r_arr).toEqual([
        [1, "1"],
        [2, "2"],
    ]);

    model.set(3, "3");
    expect(r_arr).toBeInstanceOf(Array);
    expect(r_arr).toEqual([
        [1, "1"],
        [2, "2"],
        [3, "3"],
    ]);
});

it("map model writes to reactive model", function () {
    const [{ model, r_map }] = testComponent(
        component(() => {
            let wr_map = new Map([
                [1, "1"],
                [2, "2"],
            ]);
            const model = mapModel(wr_map);
            return {
                r_map: wr_map,
                model: model,
            };
        }),
    );

    expect([...r_map]).toEqual([
        [1, "1"],
        [2, "2"],
    ]);

    model.set(3, "3");
    expect(r_map).toBeInstanceOf(Map);
    expect([...r_map]).toEqual([
        [1, "1"],
        [2, "2"],
        [3, "3"],
    ]);
});

it("tracks array length", function () {
    const [{ model, r_length }] = testComponent(
        component(() => {
            let wr_length = 0;
            const model = arrayModel([1, 2], wr_length);

            return { r_length: wr_length, model: model };
        }),
    );

    expect(r_length).toBe(2);

    model.push(3);
    expect(r_length).toBe(3);
});

it("tracks set size", function () {
    const [{ model, r_size }] = testComponent(
        component(() => {
            let wr_size = 0;
            const model = setModel([1, 2], wr_size);

            return { r_size: wr_size, model: model };
        }),
    );

    expect(r_size).toBe(2);

    model.add(3);
    expect(r_size).toBe(3);
});

it("tracks map size", function () {
    const [{ model, r_size }] = testComponent(
        component(() => {
            let wr_size = 0;
            const model = mapModel(
                [
                    [1, "1"],
                    [2, "2"],
                ],
                wr_size,
            );

            return { r_size: wr_size, model: model };
        }),
    );

    expect(r_size).toBe(2);

    model.set(3, "3");
    expect(r_size).toBe(3);
});

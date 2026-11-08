import { testComponent } from "../testComponent.js";
import { arrayModel, ArrayModelView, ArrayView, beforeMount, component, mapModel, MapModelView } from "steel-frame";

it("writes to array model from array model view", function () {
    const [{ array, setArrayModelItem }] = testComponent(
        component(() => {
            const array = arrayModel([1, 2]);

            let setArrayModelItem: ((v: number) => void)[] = [];

            <ArrayModelView
                of={array}
                slot={wr_item => {
                    beforeMount(() => {
                        setArrayModelItem.push(v => {
                            wr_item = v;
                        });
                    });
                }}
            />;

            return {
                array: array,
                setArrayModelItem: setArrayModelItem,
            };
        }),
    );

    expect(setArrayModelItem.length).toBe(2);
    expect(array.array).toEqual([1, 2]);

    setArrayModelItem[0](4);
    expect(array.array).toEqual([1, 4]);
    setArrayModelItem[1](3);
    expect(array.array).toEqual([3, 4]);
});

it("writes to array reactive value from array view", function () {
    const [{ r_array, setArrayItem }] = testComponent(
        component(() => {
            let wr_array: {
                id: number;
                value: number;
            }[] = [
                { id: 1, value: 1 },
                { id: 2, value: 2 },
            ];

            let setArrayItem: ((v: number) => void)[] = [];

            <ArrayView
                r_of={wr_array}
                key={i => i.id}
                slot={wr_item => {
                    let wr_value = wr_item.value;

                    beforeMount(() => {
                        setArrayItem.push(v => {
                            wr_value = v;
                        });
                    });
                }}
            />;

            return {
                r_array: wr_array,
                setArrayItem: setArrayItem,
            };
        }),
    );

    expect(setArrayItem.length).toBe(2);
    expect(r_array).toEqual([
        { id: 1, value: 1 },
        { id: 2, value: 2 },
    ]);

    setArrayItem[0](3);
    expect(r_array).toEqual([
        { id: 1, value: 3 },
        { id: 2, value: 2 },
    ]);
    setArrayItem[1](4);
    expect(r_array).toEqual([
        { id: 1, value: 3 },
        { id: 2, value: 4 },
    ]);
});

it("writes to map model from map model view", function () {
    const [{ map, setMapModelItem }] = testComponent(
        component(() => {
            const map = mapModel([
                [1, "1"],
                [2, "2"],
            ]);

            let setMapModelItem: ((v: string) => void)[] = [];

            <MapModelView
                of={map}
                slot={wr_item => {
                    beforeMount(() => {
                        setMapModelItem.push(v => {
                            wr_item = v;
                        });
                    });
                }}
            />;

            return {
                map: map,
                setMapModelItem: setMapModelItem,
            };
        }),
    );

    expect(setMapModelItem.length).toBe(2);
    expect([...map.map]).toEqual([
        [1, "1"],
        [2, "2"],
    ]);

    setMapModelItem[0]("3");
    expect([...map.map]).toEqual([
        [1, "3"],
        [2, "2"],
    ]);
    setMapModelItem[1]("4");
    expect([...map.map]).toEqual([
        [1, "3"],
        [2, "4"],
    ]);
});

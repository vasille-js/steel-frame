import { arrayModel, component, mapModel, setModel } from "steel-frame";

const C = component(() => {
    let wr_arr = [1, 2];
    let wr_arr_length = 0;
    let wr_map = [
        [1, 1],
        [2, 2],
    ] as const;
    let wr_map_size = 0;
    let wr_set = [1, 2];
    let wr_set_size = 0;

    const arr1 = arrayModel(wr_arr);
    const arr2 = arrayModel([1, 2], wr_arr_length);
    const map1 = mapModel(wr_map);
    const map2 = mapModel(
        [
            [1, 1],
            [2, 2],
        ],
        wr_map_size,
    );
    const set1 = setModel(wr_set);
    const set2 = setModel([1, 2], wr_set_size);
});

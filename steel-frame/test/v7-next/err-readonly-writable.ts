import { arrayModel, component } from "steel-frame";

const C = component(() => {
    let wr_a: number[] = [];
    const r_a = [...wr_a];
    const arr = arrayModel(r_a);
});

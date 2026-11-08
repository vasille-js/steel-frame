import { arrayModel, component } from "steel-frame";

const C = component(() => {
    let wr_a: number = 0;
    const r_a = wr_a + 1;
    const arr = arrayModel([], r_a);
});

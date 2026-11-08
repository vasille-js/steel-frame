import { arrayModel, component, state } from "steel-frame";

class Class {
    public wr_prop = state([1, 2]);
}

const C = component(() => {
    const obj = new Class();
    const opt = 1 > 2 ? new Class() : null;

    const arr1 = arrayModel(obj.wr_prop);
    const arr2 = arrayModel(opt?.wr_prop);
    const arr3 = arrayModel(undefined, undefined);
});

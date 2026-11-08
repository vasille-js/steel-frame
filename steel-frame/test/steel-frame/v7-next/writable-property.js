import { arrayModel, component, state, ref as VasilleRef } from "vasille-web";
class Class {
  wr_prop = VasilleRef([1, 2]);
}
const C = component(Vasille => {
  const obj = new Class();
  const opt = 1 > 2 ? new Class() : null;
  const arr1 = arrayModel(Vasille, obj.wr_prop);
  const arr2 = arrayModel(Vasille, opt?.wr_prop);
  const arr3 = arrayModel(Vasille, undefined, undefined);
});

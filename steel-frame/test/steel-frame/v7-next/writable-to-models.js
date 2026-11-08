import { arrayModel, component, mapModel, setModel, ref as VasilleRef } from "vasille-web";
const C = component(Vasille => {
  const wr_arr = VasilleRef([1, 2], Vasille);
  const wr_arr_length = VasilleRef(0, Vasille);
  const wr_map = VasilleRef([[1, 1], [2, 2]], Vasille);
  const wr_map_size = VasilleRef(0, Vasille);
  const wr_set = VasilleRef([1, 2], Vasille);
  const wr_set_size = VasilleRef(0, Vasille);
  const arr1 = arrayModel(Vasille, wr_arr);
  const arr2 = arrayModel(Vasille, [1, 2], wr_arr_length);
  const map1 = mapModel(Vasille, wr_map);
  const map2 = mapModel(Vasille, [[1, 1], [2, 2]], wr_map_size);
  const set1 = setModel(Vasille, wr_set);
  const set2 = setModel(Vasille, [1, 2], wr_set_size);
});

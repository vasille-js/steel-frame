const VasilleFilePath = "steel-frame/test/steel-frame/v7-next/writable-to-models-dev.ts";
import { arrayModel, component, mapModel, setModel, ref as VasilleRef } from "steel-frame";
const C = component(Vasille => {
  const wr_arr = VasilleRef([1, 2], Vasille, [VasilleFilePath, 4, 8, 4, 23], "wr_arr");
  const wr_arr_length = VasilleRef(0, Vasille, [VasilleFilePath, 5, 8, 5, 25], "wr_arr_length");
  const wr_map = VasilleRef([[1, 1], [2, 2]], Vasille, [VasilleFilePath, 6, 8, 9, 14], "wr_map");
  const wr_map_size = VasilleRef(0, Vasille, [VasilleFilePath, 10, 8, 10, 23], "wr_map_size");
  const wr_set = VasilleRef([1, 2], Vasille, [VasilleFilePath, 11, 8, 11, 23], "wr_set");
  const wr_set_size = VasilleRef(0, Vasille, [VasilleFilePath, 12, 8, 12, 23], "wr_set_size");
  const arr1 = arrayModel([VasilleFilePath, 14, 10, 14, 35], Vasille, wr_arr, void 0, "arr1");
  const arr2 = arrayModel([VasilleFilePath, 15, 10, 15, 50], Vasille, [1, 2], wr_arr_length, "arr2");
  const map1 = mapModel([VasilleFilePath, 16, 10, 16, 33], Vasille, wr_map, void 0, "map1");
  const map2 = mapModel([VasilleFilePath, 17, 10, 23, 5], Vasille, [[1, 1], [2, 2]], wr_map_size, "map2");
  const set1 = setModel([VasilleFilePath, 24, 10, 24, 33], Vasille, wr_set, void 0, "set1");
  const set2 = setModel([VasilleFilePath, 25, 10, 25, 46], Vasille, [1, 2], wr_set_size, "set2");
}, [VasilleFilePath, 3, 10, 26, 2], "C");

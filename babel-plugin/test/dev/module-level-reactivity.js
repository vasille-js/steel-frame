const VasilleFilePath = "babel-plugin-vasille/test/dev/module-level-reactivity.ts";
import { arrayModel, mapModel, ref, setModel } from "steel-frame";
let $a = ref(2, null, [VasilleFilePath, 3, 4, 3, 15]);
const array = arrayModel([VasilleFilePath, 5, 14, 5, 26], null, void 0);
const set = setModel([VasilleFilePath, 6, 12, 6, 22], null, void 0);
const map = mapModel([VasilleFilePath, 7, 12, 7, 22], null, void 0);
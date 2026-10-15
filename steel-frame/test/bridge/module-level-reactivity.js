import { arrayModel, mapModel, ref, setModel } from "vasille-web";
let $a = ref(1);
let $b = ref(2);
const arr = arrayModel(null, ...[[$a.V, 2, 3]]);
const set = setModel(null, [1, $b.V, 3]);
const map = mapModel(null, [[1, 2], [$a.V, 2]]);
const obj = {
  $a: ref(1),
  b: $a.V
};
let a = $a.V;
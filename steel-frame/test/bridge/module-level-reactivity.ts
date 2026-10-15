import { arrayModel, mapModel, ref, raw, setModel } from "steel-frame";

let $a = ref(1);
let $b = ref(2);

const arr = arrayModel(...[[$a, 2, 3]]);
const set = setModel([1, $b, 3]);
const map = mapModel([
  [1, 2],
  [$a, 2],
]);

const obj = {
  $a: ref(1),
  b: raw($a),
};

let a = raw($a);

import { arrayModel, mapModel, ref, raw, setModel, unwrap } from "steel-frame";

let $a = ref(1);
let $b = ref(2);

const arr = arrayModel(...[[unwrap($a), 2, 3]]);
const set = setModel([1, unwrap($b), 3]);
const map = mapModel([
    [1, 2],
    [unwrap($a), 2],
]);

const obj = {
    $a: ref(1),
    b: raw($a),
};

let a = raw($a);

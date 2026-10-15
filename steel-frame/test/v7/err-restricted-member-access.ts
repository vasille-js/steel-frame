import { compose, ref } from "steel-frame";

let obj = { $a: ref(1) };

const C = compose(() => {
  let $a = 1;
  const $expr = obj.$a + $a;
});

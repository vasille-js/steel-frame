import { compose, ref } from "steel-frame";

const o = {
  $nested: ref(2),
};
const $obj = ref(o);

const C = compose(() => {
  let $a = 0;
  const $c = $a + $obj.$nested;
});

import { compose, watch } from "steel-frame";

const C = compose(() => {
  let $a = { a: 1 };
  let $b = 2;

  watch(() => {
    $a.a = $b;
  });
});

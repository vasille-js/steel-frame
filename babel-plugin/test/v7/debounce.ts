import { compose, debounceRef } from "steel-frame";

const C = compose(() => {
  let $a = 1;
  const $b = debounceRef($a, 1);
});

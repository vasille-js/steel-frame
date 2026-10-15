import { compose, debounced } from "steel-frame";

const C = compose(() => {
  let $a = 1;
  const $b = debounced($a, 1);
});

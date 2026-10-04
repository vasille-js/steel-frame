import { compose, debounced } from "steel-frame";

const C = compose(() => {
  let a = { $b: 1 };
  const $b = debounced(a.$b, 1);
});

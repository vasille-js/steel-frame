import { compose, debounceRef } from "steel-frame";

const C = compose(() => {
  let a = { $b: 1 };
  const $b = debounceRef(a.$b, 1);
});

import { compose, debounced } from "steel-frame";

const C = compose(() => {
  const a = { $b: 1 };
  const $b = debounced(a.$b, 1);
});

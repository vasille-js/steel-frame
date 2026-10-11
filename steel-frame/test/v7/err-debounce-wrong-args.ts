import { compose, debounced } from "steel-frame";

const C = compose(() => {
  const $b = debounced(1, 1);
});

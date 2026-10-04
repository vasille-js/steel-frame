import { compose, debounceRef } from "steel-frame";

const C = compose(() => {
  const $b = debounceRef(1, 1);
});

import { compose } from "steel-frame";

const C = compose(() => {
  let $a = { a: 1, b: 2 };
  const { a: $a2, ...rest } = $a;
});

import { compose } from "steel-frame";

const C = compose(() => {
  const a = { $b: 1 };
  let $c = { a };
  const $ = $c.a.$b;
});

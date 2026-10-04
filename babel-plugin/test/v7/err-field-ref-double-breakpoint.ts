import { compose, fieldRef } from "steel-frame";

const C = compose(() => {
  const a = { $b: 1 };
  let $c = { a };
  const $ = fieldRef($c.a.$b);
});

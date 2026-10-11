import { compose } from "steel-frame";

const C = compose(() => {
  const a = { $b: 1 };
  let $c = { a };
  let $ = $c.a.$b;
});

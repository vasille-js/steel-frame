import { compose, field } from "steel-frame";

const C = compose(() => {
  const a = { $b: 1 };
  let $c = { a };
  const $ = field($c.a.$b);
});

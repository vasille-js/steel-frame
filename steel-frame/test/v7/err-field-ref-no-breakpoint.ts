import { compose, field } from "steel-frame";

const C = compose(() => {
  const a = { b: { c: { d: 1 } } };
  const $ = field(a.b.c.d);
});

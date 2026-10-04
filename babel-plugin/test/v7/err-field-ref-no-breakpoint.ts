import { compose, fieldRef } from "steel-frame";

const C = compose(() => {
  const a = { b: { c: { d: 1 } } };
  const $ = fieldRef(a.b.c.d);
});

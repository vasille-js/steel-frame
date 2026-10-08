import { compose } from "steel-frame";

const C = compose(() => {
  const a = "a";
  const o = { [a]: { a: 1 } };
});

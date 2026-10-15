import { compose } from "steel-frame";

const C = compose(() => {
  let $obj = { a: 1, b: 2 };
  const { a: $a } = $obj;
  const { ["a"]: $a1, b: $b1 } = $obj;
  const {} = $obj;
});

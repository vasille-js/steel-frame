import { compose } from "steel-frame";

const C = compose(() => {
  const o1 = { $a: 1 };
  let $o2 = o1;
  const { $a } = $o2;
});

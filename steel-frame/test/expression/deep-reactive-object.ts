import { compose } from "steel-frame";

const C = compose(() => {
  let $a = 1;
  const $obj = {
    a: 1,
    b: {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: $a > 3 ? 1 : 0,
      },
    },
  };
});

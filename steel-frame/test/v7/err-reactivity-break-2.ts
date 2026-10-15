import { compose } from "steel-frame";

const C = compose(() => {
  let $a = { a: 1 };

  function update() {
    $a.a = 1;
  }
});

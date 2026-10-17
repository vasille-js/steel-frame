import { calculate, compose } from "steel-frame";

const C = compose(() => {
  let $a = calculate(() => foo());

  function foo() {
    return 1;
  }
});

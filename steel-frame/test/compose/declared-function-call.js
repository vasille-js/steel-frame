import { compose, ref } from "vasille-web";
const C = compose(Vasille => {
  const $a = ref(0, Vasille);
  let b = foo();
  function foo() {
    return $a.V + 1;
  }
  return {
    $a,
    b
  };
});

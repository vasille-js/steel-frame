import { compose, ref } from "vasille-web";
const C = compose(Vasille => {
  const $a = ref(0, Vasille);
  function foo() {
    return $a.V + 1;
  }
  return {
    $a,
    foo
  };
});

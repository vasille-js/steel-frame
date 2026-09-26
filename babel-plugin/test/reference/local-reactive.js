import { compose, ref, expr as VasilleExpr } from "vasille-web";
const C = compose(Vasille => {
  const $arr = ref([{
    $a: ref(1, Vasille)
  }, {
    $a: ref(2, Vasille)
  }, {
    $a: ref(3, Vasille)
  }], Vasille);
  const $first = VasilleExpr(Vasille, Vasille_0 => Vasille_0.find(item => item.$a?.V > 1), [$arr]);
});
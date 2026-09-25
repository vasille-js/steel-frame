import { component, ref, set as VasilleSet, safe as VasilleSafe } from "vasille-web";
export class Test1 {
  $1 = ref(1);
  // @ts-expect-error
  ["$4"] = ref();
  constructor(data) {
    VasilleSet(null, this, "$2", 2);
    this.$3 = data.$3;
  }
  get3() {
    return this.$3?.V;
  }
  set2(v) {
    VasilleSet(null, this, "$2", v);
  }
}
class Test2 {
  $a = ref(1);
  constructor({
    $3 = ref()
  }) {
    VasilleSet(null, this, "$b", 2);
    this.$c = $3;
  }
  getC() {
    return this.$c?.V;
  }
  setB(v) {
    VasilleSet(null, this, "$b", v);
  }
}
const C = component(Vasille => {
  const $3 = ref(3, Vasille);
  const $t1 = ref(new Test1({
    $3
  }), Vasille);
  const $t2 = ref(new Test2({
    $3
  }), Vasille);
  const t4 = new Test2({
    $3
  });
  VasilleSafe(() => {
    $t2.V.setB(2);
  })();
  VasilleSafe(() => {
    console.log($3.V, $t2.V.$b?.V, $t1.V.$1?.V);
  })();
});
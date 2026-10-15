import { arrayModel, bind, calculate, compose, mapModel, ref, setModel, store, watch, safe as VasilleSafe } from "vasille-web";
const cStore = store(Vasille => {
  const $a = ref(2, Vasille);
  const $b = ref(2, Vasille);
  const $c = calculate(Vasille, (Vasille_0, Vasille_1) => Vasille_0 + Vasille_1, [$a, $b]);
  const $d = ref($c.V, Vasille);
  const e = [1, 2];
  const f = new Set([1, 2]);
  const g = new Map([[1, 2]]);
  const h = {
    a: 1
  };
  const $i = ref($a.V + $b.V, Vasille);
  const j = arrayModel(Vasille);
  const $k = watch(Vasille, (Vasille_0, Vasille_1) => Vasille_0 + Vasille_1, [$a, $b]);
  const $o = ref({
    a: {
      b: 1
    }
  }, Vasille);
  const $m = bind(Vasille, (Vasille_0, Vasille_1) => Vasille_0 + Vasille_1, [$a, $b]);
  const $n = ref(2, Vasille);
  const p = 3;
  const q = arrayModel(Vasille);
  const r = setModel(Vasille);
  const s = mapModel(Vasille);
  const t = {};
  watch(Vasille, Vasille_0 => {
    console.log(Vasille_0);
  }, [$o]);
  return {
    $a: $a,
    $b: $b,
    $c: $c,
    $d: $d,
    e: e,
    f: f,
    ["g"]: g,
    ["$$h"]: ref(h, Vasille),
    $i: $i,
    j: j,
    $k: $k,
    $o: $o
  };
});
const c = cStore;
const Component = compose(Vasille => {
  const {
    $a = ref(void 0, Vasille),
    $b = ref(void 0, Vasille),
    $d = ref(void 0, Vasille),
    $$h = ref(void 0, Vasille),
    $k = ref(void 0, Vasille),
    $o = ref(void 0, Vasille),
    $i = ref(void 0, Vasille),
    $c = ref(void 0, Vasille)
  } = c;
  watch(Vasille, (Vasille_0, Vasille_1, Vasille_2, Vasille_3, Vasille_4, Vasille_5, Vasille_6, Vasille_7) => {
    console.log(Vasille_0, Vasille_1, Vasille_2, Vasille_3);
    console.log(c.e, c.f, c.g);
    console.log(Vasille_4.a, Vasille_5, c.j);
    console.log(Vasille_6, Vasille_7.a.b);
  }, [$a, $b, $c, $d, $$h, $i, $k, $o]);
  VasilleSafe(() => console.log(c["$a"]?.V, c.$b?.V, c.$c?.V, c.$d?.V, c.e, c.f, c.g, c["$$h"].V.a, c.$i?.V, c.j, c.$k?.V, c.$o.V.a.b))();
  Vasille.tag("div", {}, Vasille => {
    Vasille.text($a);
    Vasille.text($b);
    Vasille.text($c);
    Vasille.text($d);
    Vasille.text(c.e);
    Vasille.text(c.f);
    Vasille.text(c.g);
    Vasille.text(watch(Vasille, Vasille_0 => Vasille_0.a, [$$h]));
    Vasille.text($i);
    Vasille.text(c.j);
    Vasille.text($k);
    Vasille.text(watch(Vasille, Vasille_0 => Vasille_0.a.b, [$o]));
  });
});

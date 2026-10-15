import {
  arrayModel,
  bind,
  calculate,
  compose,
  mapModel,
  ref,
  setModel,
  store,
  raw,
  watch,
  beforeMount,
} from "steel-frame";

const cStore = store(() => {
  let $a = 2;
  let $b = 2;
  const $c = calculate(() => $a + $b);
  let $d = $c;
  const e = [1, 2];
  const f = new Set([1, 2]);
  const g = new Map([[1, 2]]);
  const h = { a: 1 };
  let $i = $a + $b;
  const j = arrayModel();
  const $k = $a + $b;
  const $o = ref({ a: { b: 1 } });
  const $m = bind($a + $b);
  const $n = ref(2);
  const p = raw(3);
  const q = arrayModel();
  const r = setModel();
  const s = mapModel();
  const t = {};

  watch(() => {
    console.log($o);
  });

  return {
    $a: $a,
    $b: $b,
    $c: $c,
    $d: $d,
    e: e,
    f: f,
    ["g"]: g,
    ["$$h"]: h,
    $i: $i,
    j: j,
    $k: $k,
    $o: $o,
  };
});

const c = cStore;

const Component = compose(() => {
  const { $a, $b, $d, $$h, $k, $o, $i, $c } = c;
  watch(() => {
    console.log($a, $b, $c, $d);
    console.log(c.e, c.f, c.g);
    console.log($$h.a, $i, c.j);
    console.log($k, $o.a.b);
  });

  beforeMount(() => console.log(c["$a"], c.$b, c.$c, c.$d, c.e, c.f, c.g, c["$$h"].a, c.$i, c.j, c.$k, c.$o.a.b));

  <div>
    {$a}
    {$b}
    {$c}
    {$d}
    {c.e as any}
    {c.f as any}
    {c.g as any}
    {$$h.a as any}
    {$i as any}
    {c.j as any}
    {bind($k as any) as any}
    {$o.a.b as any}
  </div>;
});

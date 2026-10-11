import { beforeMount, bind, compose, store, watch } from "steel-frame";

const obj = { a: 1, b: 2 };

const sStore = store(() => {
  let $a = 2;
  let $b = bind(3);
  const o = { a: 1, $b: { c: 3 } };

  beforeMount(() => console.log(o.$b.c));

  return {
    $a: $a,
    $b: $b,
    o: o,
  };
});
const s = sStore;
const Component = compose(() => {
  const $a = s.$a;
  const $b = s.$b;
  const $ob = s.o.$b;
  const $bc1 = $ob.c;
  const $bc2 = $ob?.c;

  watch(() => {
    console.log($a, $b, $ob.c, $ob?.c);
  });

  beforeMount(() => console.log($a, $b, s.o.$b.c, s.o.$b?.c));

  <div>
    {$a}
    {$b}
    {$ob.c}
    {$ob?.c}
  </div>;
});

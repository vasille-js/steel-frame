import { compose, ref, safeBind, safeComputed, safeInit, safeRef } from "steel-frame";

function throwNow(): number {
  throw new Error("test");
}

interface Props {
  $a: number | undefined;
}

const A = compose<Props>(() => {});

const C = compose(() => {
  const a = safeInit(throwNow());
  const $b = safeRef(throwNow());
  const $c = safeBind(2 + throwNow());
  const $d = safeBind(($b ?? 2) + throwNow());
  const $e = safeComputed(() => {
    return throwNow();
  });

  <A $a={safeInit(throwNow())} />;
  <A $a={safeRef(throwNow())} />;
  <A $a={safeBind(2 + throwNow())} />;
  <A $a={safeBind(($b ?? 2) + throwNow())} />;
  <A $a={safeComputed(() => throwNow())} />;
  <canvas width={throwNow()} />;
  <div>{throwNow()}</div>;
});

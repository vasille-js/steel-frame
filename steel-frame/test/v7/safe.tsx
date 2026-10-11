import { compose, safeLive, safeInit, safeState } from "steel-frame";

function throwNow(): number {
  throw new Error("test");
}

interface Props {
  $a: number | undefined;
}

const A = compose<Props>(() => {});

const C = compose(() => {
  const a = safeInit(throwNow());
  const $b = safeState(throwNow());
  const $c = safeLive(2 + throwNow());
  const $d = safeLive(($b ?? 2) + throwNow());
  const $e = safeLive(() => {
    return throwNow();
  });

  <A $a={safeInit(throwNow())} />;
  <A $a={safeState(throwNow())} />;
  <A $a={safeLive(2 + throwNow())} />;
  <A $a={safeLive(($b ?? 2) + throwNow())} />;
  <canvas width={throwNow()} />;
  <div>{throwNow()}</div>;
});

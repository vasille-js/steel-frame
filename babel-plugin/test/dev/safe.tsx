import { compose } from "steel-frame";

const C1 = compose<{ $optional?: number }>(props => {
  <div>{props.$optional}</div>;
});

function throwNow(): number {
  throw new Error("x");
}

const C2 = compose(() => {
  let $a = 3;
  let $o = { a: { b: 1 }, b: 1 };

  <C1 $optional={throwNow() + $a} />;
  <C1 $optional={throwNow() + 3} />;
  <C1 $optional={$o.b} />;
  <C1 $optional={$o.a.b} />;
});

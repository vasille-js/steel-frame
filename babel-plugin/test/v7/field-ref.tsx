import { bind, compose, fieldRef } from "steel-frame";

interface Props {
  $a1: number;
  $a2: number;
}

const A = compose<Props>(() => {});

const C = compose(() => {
  let $obj = { a: 1, b: { a: 1 } };
  let $ref1 = $obj.a;
  let $ref2 = $obj.b.a;
  let $ref3 = fieldRef($obj.a);
  let $ref4 = fieldRef($obj?.b.a);

  const a = "a";
  let $ref5 = $obj[a];
  let $ref6 = $obj.b[a];
  let $ref7 = fieldRef($obj[a]);
  let $ref8 = fieldRef($obj.b[a]);

  <A $a1={$obj.a} $a2={$obj.b.a}></A>;
  <A $a1={fieldRef($obj.a)} $a2={fieldRef($obj.b.a)}></A>;
  <A $a1={bind($obj.a)} $a2={bind($obj.b.a)}></A>;
});

import { bind, compose, field } from "steel-frame";

interface Props {
  $a1: number;
  $a2: number;
}

const A = compose<Props>(() => {});

const C = compose(() => {
  let $obj = { a: 1, b: { a: 1 } };
  let $ref1 = $obj.a;
  let $ref2 = $obj.b.a;
  let $ref3 = field($obj.a);
  let $ref4 = field($obj?.b.a);

  const a = "a";
  let $ref5 = $obj[a];
  let $ref6 = $obj.b[a];
  let $ref7 = field($obj[a]);
  let $ref8 = field($obj.b[a]);

  <A $a1={$obj.a} $a2={$obj.b.a}></A>;
  <A $a1={field($obj.a)} $a2={field($obj.b.a)}></A>;
  <A $a1={bind($obj.a)} $a2={bind($obj.b.a)}></A>;
});

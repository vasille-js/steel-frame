import { compose } from "steel-frame";

const C = compose(() => {
  let $a = 0.5;
  const b = 0;

  <video property:volume={$a} />;
  <video property:volume={b} />;
  <video property:volume={1} />;
  <video property:volume={$a + 0.1} />;
  <video property:volume={b + 0.1} />;
  // @ts-expect-error
  <video property:volume />;
  <input property:value="value" />;
});

import { compose } from "steel-frame";

const C = compose(() => {
  let $a: { a: { $b: number } } | undefined = undefined;
  const $b = ($a as unknown as { a: { $b: number } })?.a.$b;
});

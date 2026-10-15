import { compose, state } from "steel-frame";

const C = compose(() => {
  const arr = [1] as const;
  let $ref = state(...arr);
});

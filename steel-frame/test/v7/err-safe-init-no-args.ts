import { compose, safeInit } from "steel-frame";

const C = compose(() => {
  // @ts-expect-error
  const a = safeInit();
});

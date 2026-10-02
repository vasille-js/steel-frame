import { styleSheet } from "steel-frame";

function use() {
  return s.c;
}

const s = styleSheet({
  // @ts-expect-error
  c: [],
});

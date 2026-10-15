import { styleSheet } from "steel-frame";

function use() {
  return s.c;
}

const s = styleSheet({
  c: {
    m: [0, ...[1]],
  },
});

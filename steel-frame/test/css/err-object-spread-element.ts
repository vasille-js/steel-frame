import { styleSheet } from "steel-frame";

function use() {
  return s.c1;
}

const s = styleSheet({
  c1: {
    padding: 2,
    ...{},
  },
});

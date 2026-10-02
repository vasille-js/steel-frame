import { theme, styleSheet } from "steel-frame";

function use() {
  return s.c1;
}

const s = styleSheet({
  c1: {
    margin: theme(23 as unknown as string, 2),
  },
});

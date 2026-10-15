import { styleSheet } from "steel-frame";

function use() {
  return s.c;
}

const s = styleSheet({
  c: {
    // @ts-expect-error
    "@media (max-width: 100px)": [23],
  },
});

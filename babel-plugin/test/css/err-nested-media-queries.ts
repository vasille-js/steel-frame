import { styleSheet } from "steel-frame";

function use() {
  return s.c;
}

const s = styleSheet({
  c: {
    "@media (max-width: 1000px)": {
      "@media (min-width: 200px)": {},
    },
  },
});

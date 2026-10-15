import { styleSheet } from "steel-frame";

function use() {
  return s.c;
}

const c = "v";
const s = styleSheet({
  c: {
    // @ts-expect-error
    [true]: "23px",
  },
});

import { styleSheet } from "steel-frame";

const c1 = "c1";

function C() {
  return styles[c1];
}

const styles = styleSheet({
  c1: { margin: 1 },
  c2: { margin: 1 },
});

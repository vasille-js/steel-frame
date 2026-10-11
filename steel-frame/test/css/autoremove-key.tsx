import { compose, styleSheet } from "steel-frame";

const C = compose(() => {
  const c1 = styles.c1;
  <div class={[styles.c2]}></div>;
});

const styles = styleSheet({
  c1: { margin: 1 },
  c2: { margin: 1 },
  c3: { margin: 1 },
});

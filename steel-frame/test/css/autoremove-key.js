import { compose, styleSheet } from "vasille-web";
const C = compose(Vasille => {
  const c1 = styles.c1;
  Vasille.tag("div", {
    c: [styles.c2]
  });
});
const styles = styleSheet({
  c1: [".{}{margin:1px}"],
  c2: [".{}{margin:1px}"]
});
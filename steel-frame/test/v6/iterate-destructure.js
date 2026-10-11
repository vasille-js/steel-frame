import { compose } from "vasille-web";
const C = compose(Vasille => {
  const arr = [{
    x: 1
  }];
  for (const item of arr) {
    const {
      x
    } = item;
    Vasille.tag("div", {}, Vasille => {
      Vasille.text(x);
    });
  }
  arr.forEach((item, index) => {
    const {
      x
    } = item;
    Vasille.tag("div", {}, Vasille => {
      Vasille.text(x + index);
    });
  });
});
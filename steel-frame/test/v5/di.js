import { compose, receive } from "vasille-web";
const C = compose(Vasille => {
  Vasille.tag("div", {
    a: {
      "data-name": receive(Vasille, "name")
    }
  }, Vasille => {
    Vasille.text(receive(Vasille, "x"));
  });
});
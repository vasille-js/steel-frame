import { compose } from "vasille-web";
const c = () => 3;
const C = compose(Vasille => {
  const compose = c;
  const sum = compose() + 2;
});
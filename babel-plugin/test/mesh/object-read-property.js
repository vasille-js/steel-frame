import { compose } from "vasille-web";
const key = "key";
const C = compose(Vasille => {
  const o = {
    key: 1
  };
  const a = o[key];
  const b = o[key];
  function f() {
    console.log(o[key]);
  }
});
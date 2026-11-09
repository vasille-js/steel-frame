import { compose } from "vasille-web";
const C = compose(Vasille => {
  Vasille.rod(() => {
    console.log("destroy called");
  });
});

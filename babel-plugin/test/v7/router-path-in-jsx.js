import { compose, safe as VasilleSafe, ref as VasilleRef } from "vasille-web";
const C = compose((Vasille, props) => {
  VasilleSafe(() => {
    Vasille.runner.router?.goTo(props["checked:path"]);
  })();
});
const D = compose(Vasille => {
  C({
    "checked:path": "/correct",
    "$checked:path": VasilleRef("/correct", Vasille)
  }, Vasille);
  C({
    "checked:path": "/correct"
  }, Vasille);
  C({
    "checked:path": `/correct/${12}`
  }, Vasille);
});
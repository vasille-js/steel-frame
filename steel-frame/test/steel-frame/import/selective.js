import { compose, ref as VasilleRef, safe as VasilleSafe } from "vasille-web";
const C = compose((Vasille, props) => {
  const {
    $a = VasilleRef(0, Vasille)
  } = props;
  VasilleSafe(() => $a.V = 3)();
});
import { compose, effect, ref as VasilleRef } from "vasille-web";
const C = compose(Vasille => {
  const wr_a = VasilleRef(1, Vasille);
  const wr_b = VasilleRef(2, Vasille);
  effect(Vasille, Vasille_0 => {
    wr_a.up(Vasille_0);
  }, [wr_b]);
});
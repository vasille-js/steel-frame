import { abortSignal, compose, Watch, ref as VasilleRef, safe as VasilleSafe } from "vasille-web";
const C = compose(Vasille => {
  const $var = VasilleRef(0, Vasille);
  const abort = abortSignal(Vasille);
  Watch({
    "$model": $var,
    slot: (Vasille, ms) => {
      VasilleSafe(() => {
        window.addEventListener("resize", () => {}, {
          signal: abortSignal(Vasille)
        });
      })();
    }
  }, Vasille);
});
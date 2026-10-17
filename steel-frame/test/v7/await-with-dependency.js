import { awaited, compose, ref as VasilleRef, expr as VasilleExpr } from "vasille-web";
function promise(num) {
  return new Promise(resolve => resolve(num));
}
const C = compose(Vasille => {
  const wr_a = VasilleRef(1, Vasille);
  const [r_err, r_data] = awaited(VasilleExpr(Vasille, Vasille_0 => async signal => {
    const r = await fetch(`/${Vasille_0}`, {
      signal
    });
    signal.throwIfAborted()
    return await r.json();
  }, [wr_a]), Vasille);
});
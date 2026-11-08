import { component, set as VasilleSet, ref as VasilleRef } from "vasille-web";
function getHandler(o) {
  return entries => VasilleSet(null, o, "$bodyHeight", entries[0].contentRect.height);
}
const Accordion = component(Vasille => {
  const o = {
    $bodyHeight: VasilleRef(0, Vasille)
  };
  const resizeObserver = new ResizeObserver(getHandler(o));
  Vasille.tag("div", {
    k: div => {
      resizeObserver.observe(div);
    }
  }, Vasille => {
    Vasille.text("Test div");
  });
});
const VasilleFilePath = "steel-frame/test/dev/text-2.tsx";
import { component, ref as VasilleRef, positionedText as VasillePosText } from "steel-frame";
const C = component(Vasille => {
  const $text = VasilleRef("text", Vasille, [VasilleFilePath, 4, 8, 4, 22], "$text");
  Vasille.text(VasillePosText($text, [VasilleFilePath, 6, 7, 6, 12]));
}, [VasilleFilePath, 3, 10, 7, 2], "C");

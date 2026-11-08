const VasilleFilePath = "steel-frame/test/dev/text.tsx";
import { component, positionedText as VasillePosText } from "steel-frame";
const C = component(Vasille => {
  Vasille.text(VasillePosText("Text", [VasilleFilePath, 4, 6, 4, 10]));
}, [VasilleFilePath, 3, 10, 5, 2], "C");

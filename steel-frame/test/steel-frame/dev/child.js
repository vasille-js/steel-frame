const VasilleFilePath = "steel-frame/test/steel-frame/dev/child.tsx";
import { component, positionedText as VasillePosText } from "steel-frame";
const C = component(Vasille => {
  Vasille.tag("div", {
    usage: [VasilleFilePath, 4, 4, 6, 10]
  }, Vasille => {
    Vasille.tag("span", {
      usage: [VasilleFilePath, 5, 8, 5, 25]
    }, Vasille => {
      Vasille.text(VasillePosText("text", [VasilleFilePath, 5, 14, 5, 18]));
    });
  });
}, [VasilleFilePath, 3, 10, 7, 2], "C");
const C2 = component(Vasille => {
  C({}, Vasille, void 0, [VasilleFilePath, 10, 4, 10, 9]);
}, [VasilleFilePath, 9, 11, 11, 2], "C2");

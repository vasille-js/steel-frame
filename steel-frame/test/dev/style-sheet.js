const VasilleFilePath = "steel-frame/test/dev/style-sheet.ts";
import { component, styleSheet } from "steel-frame";
const C = component(Vasille => {
  let c = css.div;
}, [VasilleFilePath, 3, 10, 5, 2], "C");
const css = styleSheet({
  div: [[".{}{color:red}"], [VasilleFilePath, 8, 4, 10, 5]]
});
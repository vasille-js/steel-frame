const VasilleFilePath = "babel-plugin-vasille/test/dev/prompt.tsx";
import { component, prompt, wrapFn as VasilleWrap, positionedText as VasillePosText } from "steel-frame";
const promptName = prompt(Vasille => {}, [VasilleFilePath, 3, 19, 3, 35], "promptName");
const C = component(Vasille => {
  Vasille.tag("button", {
    e: {
      click: VasilleWrap(() => promptName(Vasille, {}), [VasilleFilePath, 6, 19, 6, 46])
    },
    usage: [VasilleFilePath, 6, 2, 6, 68]
  }, Vasille => {
    Vasille.text(VasillePosText("Prompt Name", [VasilleFilePath, 6, 48, 6, 59]));
  });
}, [VasilleFilePath, 5, 10, 7, 2], "C");
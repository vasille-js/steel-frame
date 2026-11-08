const VasilleFilePath = "steel-frame/test/steel-frame/dev/prompt.tsx";
import { component, prompt, showPrompt, wrapFn as VasilleWrap, positionedText as VasillePosText } from "steel-frame";
const promptName = prompt(Vasille => {}, [VasilleFilePath, 3, 19, 3, 35], "promptName");
const C = component(Vasille => {
  Vasille.tag("button", {
    e: {
      click: VasilleWrap(() => showPrompt(Vasille, promptName, {}, 0, [VasilleFilePath, 6, 27, 6, 53]), [VasilleFilePath, 6, 21, 6, 53])
    },
    usage: [VasilleFilePath, 6, 4, 6, 75]
  }, Vasille => {
    Vasille.text(VasillePosText("Prompt Name", [VasilleFilePath, 6, 55, 6, 66]));
  });
}, [VasilleFilePath, 5, 10, 7, 2], "C");

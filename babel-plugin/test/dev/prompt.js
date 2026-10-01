const VasilleFilePath = "babel-plugin-vasille/test/dev/prompt.tsx";
import { component, prompt, showPrompt, wrapFn as VasilleWrap, positionedText as VasillePosText } from "steel-frame";
const promptName = prompt(Vasille => {}, [VasilleFilePath, 3, 19, 3, 35], "promptName");
const C = component(Vasille => {
  Vasille.tag("button", {
    e: {
      click: VasilleWrap(() => showPrompt(Vasille, promptName, {}, 0, [VasilleFilePath, 6, 25, 6, 51]), [VasilleFilePath, 6, 19, 6, 51])
    },
    usage: [VasilleFilePath, 6, 2, 6, 73]
  }, Vasille => {
    Vasille.text(VasillePosText("Prompt Name", [VasilleFilePath, 6, 53, 6, 64]));
  });
}, [VasilleFilePath, 5, 10, 7, 2], "C");
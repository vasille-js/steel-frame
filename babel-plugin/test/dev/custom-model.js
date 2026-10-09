const VasilleFilePath = "babel-plugin-vasille/test/dev/custom-model.ts";
import { compose, createModel, model } from "steel-frame";
const customModel = model(Vasille => ({}), [VasilleFilePath, 3, 20, 3, 37], "customModel");
const C = compose(Vasille => {
  const custom = createModel(Vasille, customModel, {}, [VasilleFilePath, 6, 17, 6, 45]);
}, [VasilleFilePath, 5, 10, 7, 2], "C");
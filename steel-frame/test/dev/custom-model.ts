import { compose, createModel, model } from "steel-frame";

const customModel = model(() => ({}));

const C = compose(() => {
  const custom = createModel(customModel, {});
});

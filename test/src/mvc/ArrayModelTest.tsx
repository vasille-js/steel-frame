import { arrayModel, ArrayModelView, component } from "steel-frame";

export const ArrayModelTest = component(() => {
  <ArrayModelView
    of={model}
    slot={value => {
      <div>Hello {value}!</div>;
    }}
  />;
});

const model = arrayModel(["x"]);

export const control = {
  addValue(value: string) {
    model.push(value);
  },
  replaceValue(index: number, value: string) {
    model.replace(index, value);
  },
};

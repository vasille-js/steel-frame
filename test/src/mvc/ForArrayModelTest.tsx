import { arrayModel, component, For, view } from "steel-frame";

export const ForArrayModelTest = component(() => {
  <For
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

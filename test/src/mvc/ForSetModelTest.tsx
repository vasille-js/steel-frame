import { For, setModel, component } from "steel-frame";

export const ForSetModelTest = component(() => {
  <For
    of={model}
    slot={value => {
      <div>Hello {value}!</div>;
    }}
  />;
});

const model = setModel(["m"]);

export const control = {
  addValue(value: string) {
    model.add(value);
  },
  removeValue(value: string) {
    model.delete(value);
  },
};

import { setModel, component, SetModelView } from "steel-frame";

export const SetModelTest = component(() => {
  <SetModelView
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

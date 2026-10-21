import { For, mapModel, component } from "steel-frame";

export const ForMapModelTest = component(() => {
  <For
    of={model}
    slot={value => {
      <div>Hello {value}!</div>;
    }}
  />;
});

const model = mapModel([[0, "a"]]);

export const control = {
  setValue(key: number, value: string) {
    model.set(key, value);
  },
};

import { mapModel, component, MapModelView } from "steel-frame";

export const MapModelTest = component(() => {
  <MapModelView
    of={model}
    slot={r_value => {
      <div>Hello {r_value}!</div>;
    }}
  />;
});

const model = mapModel([[0, "a"]]);

export const control = {
  setValue(key: number, value: string) {
    model.set(key, value);
  },
};

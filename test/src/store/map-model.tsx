import { store, For, component, mapModel, MapModelView } from "steel-frame";

const modelStore = store(() => {
  const map = mapModel([[0, "a"]]);

  return {
    map,
    setValue(key: number, value: string) {
      map.set(key, value);
    },
  };
});

const Component = component(() => {
  <MapModelView
    of={modelStore.map}
    slot={r_value => {
      <div>Hello {r_value}!</div>;
    }}
  />;
});

export const x = { model: modelStore, Component };

import { store, view, For, component, setModel, SetModelView } from "steel-frame";

const modelStore = store(() => {
  const s = setModel(["m"]);

  return {
    s,
    addValue(value: string) {
      s.add(value);
    },
    removeValue(value: string) {
      s.delete(value);
    },
  };
});

const Component = component(() => {
  <SetModelView
    of={modelStore.s}
    slot={value => {
      <div>Hello {value}!</div>;
    }}
  />;
});

export const x = { model: modelStore, Component };

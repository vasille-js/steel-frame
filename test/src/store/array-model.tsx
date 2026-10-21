import { arrayModel, ArrayModelView, component, For, store } from "steel-frame";

const modelStore = store(() => {
  const arr = arrayModel(["x"]);

  return {
    arr,
    addValue(value: string) {
      arr.push(value);
    },
    replaceValue(index: number, value: string) {
      arr.replace(index, value);
    },
  };
});

const Component = component(() => {
  <ArrayModelView
    of={modelStore.arr}
    slot={value => {
      <div>Hello {value}!</div>;
    }}
  />;
});

export const x = { model: modelStore, Component };

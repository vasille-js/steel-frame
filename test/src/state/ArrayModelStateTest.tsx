import { For, beforeMount, component, arrayModel } from "steel-frame";

export const ArrayModelStateTest = component(() => {
  const model = arrayModel(["x"]);

  beforeMount(() => {
    control = {
      addValue(value: string) {
        model.push(value);
      },
      replaceValue(index: number, value: string) {
        model.replace(index, value);
      },
    };
  });

  <For
    of={model}
    slot={value => {
      <div>Hello {value}!</div>;
    }}
  />;
});

export let control:
  | {
      addValue(value: string): void;
      replaceValue(index: number, value: string): void;
    }
  | undefined = undefined;

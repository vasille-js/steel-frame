import { view, For, component, beforeMount, mapModel, MapModelView } from "steel-frame";

export const MapModelStateTest = component(() => {
  const model = mapModel([[0, "a"]]);

  beforeMount(() => {
    control = {
      setValue(key: number, value: string) {
        model.set(key, value);
      },
    };
  });

  <MapModelView
    of={model}
    slot={r_value => {
      <div>Hello {r_value}!</div>;
    }}
  />;
});

export let control:
  | {
      setValue(key: number, value: string): void;
    }
  | undefined = undefined;

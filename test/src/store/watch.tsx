import { bypassWriteRestriction, component, store, view, watch } from "steel-frame";

const modelStore = store(() => {
  let wr_name = "Vasille";
  let $external = "test";

  watch(() => {
    bypassWriteRestriction(wr_name, "+" + $external);
  });

  return {
    $name: wr_name,
    $external,
    setValue(value: string) {
      $external = value;
    },
  };
});

const Watch = component(() => {
  <div>Hello {modelStore.$name}!</div>;
});

export const x = { Watch, model: modelStore };

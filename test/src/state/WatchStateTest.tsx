import { beforeMount, bypassWriteRestriction, component, view, watch } from "steel-frame";

export const WatchStateTest = component(() => {
  let wr_name = "Vasille";
  let $external = "test";

  watch(() => {
    bypassWriteRestriction(wr_name, "+" + $external);
  });

  beforeMount(() => {
    control = {
      setValue(value: string) {
        $external = value;
      },
    };
  });

  <div>Hello {wr_name}!</div>;
});

export let control: { setValue(value: string): void } | undefined = undefined;

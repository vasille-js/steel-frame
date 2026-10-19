import { beforeMount, component } from "steel-frame";

export const RefEditStateTest = component(() => {
  let $text = "test";

  beforeMount(() => {
    control = {
      setValue(value: string) {
        $text = value;
      },
    };
  });

  <div>Hello {$text}!</div>;
});

export let control: { setValue(value: string): void } | undefined = undefined;

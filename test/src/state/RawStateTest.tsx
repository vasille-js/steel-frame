import { beforeMount, component, raw, view } from "steel-frame";

export const RawStateTest = component(() => {
  let $r = "test";
  const text = raw($r);

  beforeMount(() => {
    control = {
      setValue(value: string) {
        $r = value;
      },
    };
  });

  <div>Hello {text}!</div>;
});

export let control: { setValue(value: string): void } | undefined = undefined;

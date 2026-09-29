import { beforeMount, component } from "steel-frame";

const C = component(() => {
  const arr: { $x?: 1 } = {};

  beforeMount(() => {
    arr.$x = 1;
  });
});

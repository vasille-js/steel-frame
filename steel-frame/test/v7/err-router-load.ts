import { beforeMount, compose, router } from "steel-frame";

const C = compose(() => {
  beforeMount(() => {
    router()?.load("/correct");
    router()?.load("/wrong");
  });
});

import { abortSignal, beforeMount, compose, Watch } from "steel-frame";

const C = compose(() => {
  let $var = 0;
  const abort = abortSignal();

  <Watch
    $model={$var}
    slot={ms => {
      beforeMount(() => {
        window.addEventListener("resize", () => {}, { signal: abortSignal() });
      });
    }}
  />;
});

import { beforeMount, compose } from "steel-frame";

const C = compose((props: { $a: number }) => {
  let { $a = 0 } = props;
  beforeMount(() => ($a = 3));
});

import * as DX from "steel-frame";

const C = DX["compose"]((props: { a: number }) => {
  let { a } = props;
  DX.beforeMount(() => (a = 3));
});

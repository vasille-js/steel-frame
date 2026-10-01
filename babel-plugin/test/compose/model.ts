import { beforeMount, compose, createModel, model } from "steel-frame";

const testModel = model(() => {
  let $a = 1;

  return { $a };
});

const test2Model = model((props: { a: number }) => {
  return { $a: props.a };
});

const C = compose(() => {
  const test1 = createModel(testModel, {});
  const test2 = createModel(test2Model, { a: 1 });

  beforeMount(() => {
    test1.$a satisfies number;
    test2.$a satisfies number;
  });
});

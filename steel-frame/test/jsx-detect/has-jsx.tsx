import { afterMount, compose, Slot } from "steel-frame";

const C = compose(
  (props: {
    slot01(props: { a: number; b: number }): void;
    slot02?(props: { $a: number; $b: number }): void;
    slot03(): void;
  }) => {
    const { slot02 } = props;
    <Slot model={slot02} $a={1} $b={2} />;
  },
);

const C1 = compose(() => {
  <C
    slot01={({ a, b }) => {
      console.log(a, b);
    }}
    slot02={props => {
      const { $a, $b } = props;
      <div />;
      afterMount(() => console.log($a, $b));
    }}
    slot03={() => <div />}
  />;
});

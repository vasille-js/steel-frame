import { Slot, compose, afterMount, beforeMount } from "steel-frame";

const C1 = compose((props: { slot(props: { $a: number }): void }) => {
  const { slot } = props;
  let $a = 0;

  <div>
    <Slot model={slot} $a={$a} />
  </div>;
});

const C2 = compose(() => {
  let $a = 2;

  <C1
    slot={(props: { $a: number }) => {
      const { $a } = props;
      beforeMount(() => console.log($a));
    }}
  />;
  <C1
    slot={props => {
      const { $a } = props;
      beforeMount(() => console.log($a));

      <>{$a}</>;
    }}
  />;
  <C1
    slot={() => {
      <div />;
    }}
  />;

  afterMount(() => console.log($a));
});

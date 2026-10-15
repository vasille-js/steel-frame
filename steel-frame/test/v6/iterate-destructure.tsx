import { compose, ForEach, Iterate } from "steel-frame";

const C = compose(() => {
  const arr = [{ x: 1 }];

  <Iterate
    value={arr}
    slot={item => {
      const { x } = item;
      <div>{x}</div>;
    }}
  />;
  <ForEach
    value={arr}
    slot={(item, index) => {
      const { x } = item;
      <div>{x + index}</div>;
    }}
  />;
});

import { compose, Iterate } from "steel-frame";

const C = compose(() => {
  let arr = [{ x: 1 }];

  <Iterate value={arr} slot={({ x }) => {}} />;
});

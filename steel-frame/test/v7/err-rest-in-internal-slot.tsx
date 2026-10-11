import { compose, Iterate } from "steel-frame";

const C = compose(() => {
  let arr = [];

  <Iterate value={arr} slot={(...args) => {}} />;
});

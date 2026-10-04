import { compose, receive } from "steel-frame";

const C = compose(() => {
  <div data-name={receive("name")}>{receive("x")}</div>;
});

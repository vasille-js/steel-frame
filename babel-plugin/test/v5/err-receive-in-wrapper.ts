import { compose, receive } from "steel-frame";

export default compose(() => {
  const x = receive("x");
});

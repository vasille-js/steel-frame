import { compose, share } from "steel-frame";

export default compose(() => {
  share("global", "x");
});

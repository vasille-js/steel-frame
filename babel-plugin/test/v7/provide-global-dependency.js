import { compose, share } from "vasille-web";
export default compose(Vasille => {
  share(Vasille, "global", "x");
});
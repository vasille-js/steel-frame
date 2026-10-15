import { component, impute, receive, share } from "vasille-web";
const C = component(Vasille => {
  const shared = share(Vasille, "x", "y");
  const received = receive(Vasille, "x");
  const fallback = impute(Vasille, "y", "z");
  share(Vasille, "a", "b");
});
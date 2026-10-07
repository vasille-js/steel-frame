import { compose, receive } from "steel-frame";

export const DependencyStart = compose(() => {
  const x = receive("unexisting");
});

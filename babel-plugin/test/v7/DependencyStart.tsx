import { compose, receive } from "steel-frame";
import { Reference } from "vasille";

export const DependencyStart = compose(() => {
  const x = receive("unexisting");
  const y = new Reference(1);
});

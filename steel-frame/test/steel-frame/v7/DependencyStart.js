import { compose, receive } from "vasille-web";
import { Reference } from "steel-frame/core";
export const DependencyStart = compose(Vasille => {
  const x = receive(Vasille, "unexisting");
  const y = new Reference(1);
});

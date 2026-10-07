import { compose, receive } from "vasille-web";
export const DependencyStart = compose(Vasille => {
  const x = receive(Vasille, "unexisting");
});
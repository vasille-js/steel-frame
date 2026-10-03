import { compose, receive } from "steel-frame";

const C = compose(() => {
  const a = "key";
  const b = receive(a);
});

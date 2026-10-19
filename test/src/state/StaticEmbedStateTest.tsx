import { component, view } from "steel-frame";

export const StaticEmbedStateTest = component(() => {
  <div>Hello world!</div>;
  <Embed />;
});

const Embed = component(() => {
  <div>Embed</div>;
});

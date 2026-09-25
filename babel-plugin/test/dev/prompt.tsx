import { component, ctx, prompt } from "steel-frame";

const promptName = prompt(() => {});

const C = component(() => {
  <button onclick={() => promptName(ctx(), {})}>Prompt Name</button>;
});

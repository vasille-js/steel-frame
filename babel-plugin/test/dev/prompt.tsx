import { component, prompt, showPrompt } from "steel-frame";

const promptName = prompt(() => {});

const C = component(() => {
  <button onclick={() => showPrompt(promptName, {})}>Prompt Name</button>;
});

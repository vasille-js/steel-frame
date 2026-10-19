import { beforeMount, component, prompt, showPrompt } from "steel-frame";

export const PromptTestApp = component(() => {
  beforeMount(() => {
    control = {
      prompt(): Promise<string> {
        return showPrompt(promptName, {});
      },
    };
  });

  <div class="app"></div>;
});

let _resolve: ((v: string) => void) | null = null;
let _reject: ((v: unknown) => void) | null = null;

export function resolvePrompt(value: string) {
  _resolve?.(value);
}

export function rejectPrompt(error: string) {
  _reject?.(error);
}

const promptName = prompt<string>(props => {
  const { reject, resolve } = props;
  beforeMount(() => {
    _resolve = resolve;
    _reject = reject;
  });

  <div class="prompt"></div>;
});

export let control: {
  prompt(): Promise<string>;
} | null = null;

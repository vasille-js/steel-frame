import { testComponent } from "../testComponent.js";
import { beforeMount, component, prompt, showPrompt } from "steel-frame";

let _resolve: ((v: string) => void) | null = null;

export function resolvePrompt(value: string) {
    _resolve?.(value);
}

const promptName = prompt<string>(props => {
    const { resolve } = props;
    beforeMount(() => {
        _resolve = resolve;
    });

    <div class="prompt"></div>;
});

export let control: {
    prompt(): Promise<string>;
} | null = null;

it("Prompt test", async function () {
    const [_control, body] = testComponent(
        component(() => {
            beforeMount(() => {
                control = {
                    prompt(): Promise<string> {
                        return showPrompt(promptName, {});
                    },
                };
            });

            <div class="app"></div>;
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].className).toBe("app");

    setTimeout(() => {
        expect(body.children.length).toBe(2);
        expect(body.children[1].className).toBe("prompt");
        resolvePrompt("ok");
    });
    expect(await control?.prompt()).toBe("ok");
});

import { testComponent } from "../testComponent.js";
import { beforeMount, component, prompt, showPrompt } from "steel-frame";

let _reject: ((v: unknown) => void) | null = null;

export function rejectPrompt(error: string) {
    _reject?.(error);
}

const promptName = prompt<string>(props => {
    const { reject } = props;
    beforeMount(() => {
        _reject = reject;
    });

    <div class="prompt"></div>;
});

let control: {
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
        rejectPrompt("test fail error");
    });
    await expect(control?.prompt()).rejects.toBe("test fail error");
});

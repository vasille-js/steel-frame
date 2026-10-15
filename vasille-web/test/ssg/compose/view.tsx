import { beforeMount, page, prompt, showPrompt, Slot, view } from "steel-frame";

interface Props {
    slot?(): void;
}

const promptError = prompt(() => {});

export let controller: { promptError(): void } | null = null;

const DivView = view((props: Props) => {
    const { slot } = props;
    <div class="view">
        <Slot slot={slot} />
    </div>;
});

export default page(async () => {
    beforeMount(() => {
        controller = {
            promptError() {
                showPrompt(promptError, {});
            },
        };
    });

    <DivView />;
    <DivView>
        <span>Hello</span>
    </DivView>;
});

export function runViewDirectly() {
    DivView({});
}

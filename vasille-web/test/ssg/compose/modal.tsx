import { modal, page, Slot } from "steel-frame";

interface Props {
    slot?(): void;
}

export default page(async () => {
    <div class="container">
        <div class="div1" />
        <DivModal />
        <div class="div2" />
        <DivModal
            slot={() => {
                <span>Hello</span>;
            }}
        />
    </div>;
});

const DivModal = modal((props: Props) => {
    const { slot } = props;
    <div class="modal">
        <Slot slot={slot} />
    </div>;
});

export function runModalDirectly() {
    DivModal({});
}

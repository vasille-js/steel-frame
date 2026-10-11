import { modal, page, Slot } from "steel-frame";

interface Props {
    slot?(): void;
}

const DivModal = modal((props: Props) => {
    const { slot } = props;
    <div class="modal">
        <Slot slot={slot} />
    </div>;
});

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

export function runModalDirectly() {
    DivModal({});
}

import { testComponent } from "../testComponent.js";
import { component, modal } from "steel-frame";

interface Props {
    title: string;
}

const Modal = modal((props: Props) => {
    <div class="modal">{props.title}</div>;
});

it("Test Modal", function () {
    const [control, body] = testComponent(
        component(() => {
            <div class="root">
                <Modal title={"test"} />
            </div>;
        }),
    );

    expect(body.children.length).toBe(2);
    expect(body.children[0].className).toBe("root");
    expect(body.children[1].className).toBe("modal");
});

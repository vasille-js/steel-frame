import { testComponent } from "../testComponent.js";
import { component, ref, store } from "steel-frame";

const modelStore = store(() => {
    let $text = ref("test");

    return {
        $text,
        setValue(value: string) {
            $text = value;
        },
    };
});

it("Store ref call", function () {
    const [control, body] = testComponent(
        component(() => {
            <div>Hello {modelStore.$text}!</div>;
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello test!");
    modelStore?.setValue("world");
    expect(body.children[0].innerHTML).toBe("Hello world!");
});

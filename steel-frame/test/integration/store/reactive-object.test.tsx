import { testComponent } from "../testComponent.js";
import { component, store } from "steel-frame";

const modelStore = store(() => {
    const obj = { $text: "test" };

    return {
        obj: obj,
        setValue(value: string) {
            obj.$text = value;
        },
    };
});

it("Store dynamic content with reactive object", function () {
    const [control, body] = testComponent(
        component(() => {
            <div>Hello {modelStore.obj.$text}!</div>;
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello test!");
    modelStore?.setValue("world");
    expect(body.children[0].innerHTML).toBe("Hello world!");
});

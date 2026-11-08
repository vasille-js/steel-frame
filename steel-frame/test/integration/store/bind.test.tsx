import { testComponent } from "../testComponent.js";
import { bind, component, store } from "steel-frame";

const modelStore = store(() => {
    let $r = "test";
    const $text = bind("+" + $r);

    return {
        $r,
        $text,
        setValue(value: string) {
            $r = value;
        },
    };
});

it("Store bind expression", function () {
    const [control, body] = testComponent(
        component(() => {
            <div>Hello {modelStore.$text}!</div>;
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello +test!");
    modelStore?.setValue("world");
    expect(body.children[0].innerHTML).toBe("Hello +world!");
});

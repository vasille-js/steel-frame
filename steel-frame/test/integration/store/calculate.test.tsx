import { testComponent } from "../testComponent.js";
import { calculate, component, store } from "steel-frame";

const modelStore = store(() => {
    let $r = "test";
    let $text = calculate(() => {
        return "+" + $r;
    });

    return {
        $r,
        $text,
        setValue(value: string) {
            $r = value;
        },
    };
});

it("Store calculate call", function () {
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

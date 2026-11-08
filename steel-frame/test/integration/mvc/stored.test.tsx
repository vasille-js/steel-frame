import { testComponent } from "../testComponent.js";
import { component, raw, ref } from "steel-frame";

it("MVC stored call", function () {
    const [control, body] = testComponent(
        component(() => {
            let $r = ref("test");
            const text = raw($r);
            <div>Hello {text}!</div>;
            return {
                setValue(value: string) {
                    $r = value;
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello test!");
    control?.setValue("world");
    expect(body.children[0].innerHTML).toBe("Hello test!");
});

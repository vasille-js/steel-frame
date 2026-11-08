import { testComponent } from "../testComponent.js";
import { component, raw } from "steel-frame";

it("value call in component", function () {
    const [control, body] = testComponent(
        component(() => {
            let $r = "test";
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

import { testComponent } from "../testComponent.js";
import { component } from "steel-frame";

it("dynamic component", function () {
    const [control, body] = testComponent(
        component(() => {
            let $text = "test";

            <div>Hello {$text}!</div>;

            return {
                setValue(value: string) {
                    $text = value;
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello test!");
    control?.setValue("world");
    expect(body.children[0].innerHTML).toBe("Hello world!");
});

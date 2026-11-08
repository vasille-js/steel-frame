import { testComponent } from "../testComponent.js";
import { calculate, component } from "steel-frame";

it("calculate call in component", function () {
    const [control, body] = testComponent(
        component(() => {
            let $r = "test";
            const $text = calculate(() => {
                return "+" + $r;
            });

            <div>Hello {$text}!</div>;

            return {
                setValue(value: string) {
                    $r = value;
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello +test!");
    control?.setValue("world");
    expect(body.children[0].innerHTML).toBe("Hello +world!");
});

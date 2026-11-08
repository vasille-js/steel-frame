import { testComponent } from "../testComponent.js";
import { component } from "steel-frame";

it("dynamic component with reactive object", function () {
    const [control, body] = testComponent(
        component(() => {
            const data = { $text: "test" };

            <div>Hello {data.$text}!</div>;

            return {
                setValue(value: string) {
                    data.$text = value;
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello test!");
    control?.setValue("world");
    expect(body.children[0].innerHTML).toBe("Hello world!");
});

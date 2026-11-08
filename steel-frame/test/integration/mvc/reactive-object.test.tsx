import { testComponent } from "../testComponent.js";
import { component, ref } from "steel-frame";

it("MVC dynamic content with reactive object", function () {
    const [control, body] = testComponent(
        component(() => {
            const data = { $text: ref("test") };
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

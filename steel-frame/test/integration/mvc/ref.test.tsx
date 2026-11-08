import { testComponent } from "../testComponent.js";
import { component, ref } from "steel-frame";

it("MVC ref call", function () {
    const [control, body] = testComponent(
        component(() => {
            let $text = ref("test");
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

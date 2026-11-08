import { testComponent } from "../testComponent.js";
import { component, ref } from "steel-frame";

it("ref call in component", function () {
    const [control, body] = testComponent(
        component(() => {
            let $r = ref("test");

            <div>Hello {$r}!</div>;

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
    expect(body.children[0].innerHTML).toBe("Hello world!");
});

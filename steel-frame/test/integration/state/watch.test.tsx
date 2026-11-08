import { testComponent } from "../testComponent.js";
import { bypassWriteRestriction, component, watch } from "steel-frame";

it("watch call in component", function () {
    const [control, body] = testComponent(
        component(() => {
            let wr_name = "Vasille";
            let $external = "test";

            watch(() => {
                bypassWriteRestriction(wr_name, "+" + $external);
            });

            <div>Hello {wr_name}!</div>;

            return {
                setValue(value: string) {
                    $external = value;
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello +test!");
    control?.setValue("world");
    expect(body.children[0].innerHTML).toBe("Hello +world!");
});

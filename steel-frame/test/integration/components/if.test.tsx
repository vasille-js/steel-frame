import { testComponent } from "../testComponent.js";
import { component, If, ref } from "steel-frame";

it("If component test", function () {
    const [control, body] = testComponent(
        component(() => {
            let $state = ref("test");
            <If $condition={$state === "if"}>
                <div>{$state}</div>
            </If>;
            return {
                setValue(value: string) {
                    $state = value;
                },
            };
        }),
    );

    expect(body.children.length).toBe(0);
    control.setValue("if");
    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("if");
    control.setValue("else");
    expect(body.children.length).toBe(0);
});

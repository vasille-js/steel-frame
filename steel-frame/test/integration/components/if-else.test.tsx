import { testComponent } from "../testComponent.js";
import { component, Else, If, ref } from "steel-frame";

it("Else component test", function () {
    const [control, body] = testComponent(
        component(() => {
            let $state = ref("test");
            <>
                <If $condition={$state === "if"}>
                    <div>if</div>
                </If>
                <Else>
                    <div>else</div>
                </Else>
            </>;
            return {
                setValue(value: string) {
                    $state = value;
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("else");
    control.setValue("if");
    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("if");
    control.setValue("else");
    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("else");
});

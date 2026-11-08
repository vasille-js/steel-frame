import { testComponent } from "../testComponent.js";
import { component, Else, ElseIf, If, ref } from "steel-frame";

it("ElseIf component test", function () {
    const [control, body] = testComponent(
        component(() => {
            let $state = ref("test");
            <>
                <If $condition={$state === "if"}>
                    <div>if</div>
                </If>
                <ElseIf $condition={$state === "else-if"}>
                    <div>else-if</div>
                </ElseIf>
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
    control.setValue("else-if");
    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("else-if");
});

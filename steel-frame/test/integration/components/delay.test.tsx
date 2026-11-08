import { testComponent } from "../testComponent.js";
import { component, Delay, ref } from "steel-frame";

it("Delay component test", function (done) {
    const [control, body] = testComponent(
        component(() => {
            let $state = ref("test");
            <Delay time={1}>
                <div>{$state}</div>
            </Delay>;
            return {
                setValue(value: string) {
                    $state = value;
                },
            };
        }),
    );

    expect(body.children.length).toBe(0);
    setTimeout(() => {
        expect(body.children.length).toBe(1);
        expect(body.children[0].innerHTML).toBe("test");
        control.setValue("Vasille");
        expect(body.children[0].innerHTML).toBe("Vasille");
        done();
    }, 10);
});

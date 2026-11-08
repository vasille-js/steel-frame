import { testComponent } from "../testComponent.js";
import { beforeMount, component, ref, Watch } from "steel-frame";

it("WatchStore component test", function () {
    const strings: string[] = [];
    const [control, body] = testComponent(
        component(() => {
            let $state = ref("test");
            <Watch
                $model={$state}
                slot={value => {
                    beforeMount(() => {
                        strings.push(value);
                    });
                    <div>{value}</div>;
                }}
            />;
            return {
                setValue(value: string) {
                    $state = value;
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("test");
    expect(strings).toStrictEqual(["test"]);
    control.setValue("watch");
    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("watch");
    expect(strings).toStrictEqual(["test", "watch"]);
});

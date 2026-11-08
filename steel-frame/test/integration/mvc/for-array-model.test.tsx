import { testComponent } from "../testComponent.js";
import { arrayModel, component, For } from "steel-frame";

it("MVC array model", function () {
    const [control, body] = testComponent(
        component(() => {
            const model = arrayModel(["x"]);
            <For
                of={model}
                slot={value => {
                    <div>Hello {value}!</div>;
                }}
            />;
            return {
                addValue(value: string) {
                    model.push(value);
                },
                replaceValue(index: number, value: string) {
                    model.replace(index, value);
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello x!");
    control?.addValue("y");
    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("Hello x!");
    expect(body.children[1].innerHTML).toBe("Hello y!");
    control?.addValue("z");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello x!");
    expect(body.children[1].innerHTML).toBe("Hello y!");
    expect(body.children[2].innerHTML).toBe("Hello z!");
    control?.replaceValue(1, "a");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello x!");
    expect(body.children[1].innerHTML).toBe("Hello a!");
    expect(body.children[2].innerHTML).toBe("Hello z!");
});

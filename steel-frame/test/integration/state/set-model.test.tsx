import { testComponent } from "../testComponent.js";
import { component, For, setModel } from "steel-frame";

it("set model in component", function () {
    const [control, body] = testComponent(
        component(() => {
            const model = setModel(["m"]);

            <For
                of={model}
                slot={value => {
                    <div>Hello {value}!</div>;
                }}
            />;

            return {
                addValue(value: string) {
                    model.add(value);
                },
                removeValue(value: string) {
                    model.delete(value);
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello m!");
    control?.addValue("n");
    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("Hello m!");
    expect(body.children[1].innerHTML).toBe("Hello n!");
    control?.addValue("o");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello m!");
    expect(body.children[1].innerHTML).toBe("Hello n!");
    expect(body.children[2].innerHTML).toBe("Hello o!");
    control?.removeValue("n");
    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("Hello m!");
    expect(body.children[1].innerHTML).toBe("Hello o!");
});

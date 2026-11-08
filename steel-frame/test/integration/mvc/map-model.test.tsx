import { testComponent } from "../testComponent.js";
import { component, mapModel, MapModelView } from "steel-frame";

it("MVC map model", function () {
    const [control, body] = testComponent(
        component(() => {
            const model = mapModel([[0, "a"]]);
            <MapModelView
                of={model}
                slot={r_value => {
                    <div>Hello {r_value}!</div>;
                }}
            />;
            return {
                setValue(key: number, value: string) {
                    model.set(key, value);
                },
            };
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello a!");
    control?.setValue(1, "b");
    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("Hello a!");
    expect(body.children[1].innerHTML).toBe("Hello b!");
    control?.setValue(2, "c");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello a!");
    expect(body.children[1].innerHTML).toBe("Hello b!");
    expect(body.children[2].innerHTML).toBe("Hello c!");
    control?.setValue(1, "z");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello a!");
    expect(body.children[1].innerHTML).toBe("Hello z!");
    expect(body.children[2].innerHTML).toBe("Hello c!");
});

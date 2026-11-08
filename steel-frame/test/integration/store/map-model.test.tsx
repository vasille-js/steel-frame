import { testComponent } from "../testComponent.js";
import { component, mapModel, MapModelView, store } from "steel-frame";

const modelStore = store(() => {
    const map = mapModel([[0, "a"]]);

    return {
        map,
        setValue(key: number, value: string) {
            map.set(key, value);
        },
    };
});

it("Store map model", function () {
    const [control, body] = testComponent(
        component(() => {
            <MapModelView
                of={modelStore.map}
                slot={r_value => {
                    <div>Hello {r_value}!</div>;
                }}
            />;
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello a!");
    modelStore?.setValue(1, "b");
    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("Hello a!");
    expect(body.children[1].innerHTML).toBe("Hello b!");
    modelStore?.setValue(2, "c");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello a!");
    expect(body.children[1].innerHTML).toBe("Hello b!");
    expect(body.children[2].innerHTML).toBe("Hello c!");
    modelStore?.setValue(1, "z");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello a!");
    expect(body.children[1].innerHTML).toBe("Hello z!");
    expect(body.children[2].innerHTML).toBe("Hello c!");
});

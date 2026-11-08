import { testComponent } from "../testComponent.js";
import { component, setModel, SetModelView, store } from "steel-frame";

const modelStore = store(() => {
    const s = setModel(["m"]);

    return {
        s,
        addValue(value: string) {
            s.add(value);
        },
        removeValue(value: string) {
            s.delete(value);
        },
    };
});

it("Store set model", function () {
    const [control, body] = testComponent(
        component(() => {
            <SetModelView
                of={modelStore.s}
                slot={value => {
                    <div>Hello {value}!</div>;
                }}
            />;
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello m!");
    modelStore?.addValue("n");
    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("Hello m!");
    expect(body.children[1].innerHTML).toBe("Hello n!");
    modelStore?.addValue("o");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello m!");
    expect(body.children[1].innerHTML).toBe("Hello n!");
    expect(body.children[2].innerHTML).toBe("Hello o!");
    modelStore?.removeValue("n");
    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("Hello m!");
    expect(body.children[1].innerHTML).toBe("Hello o!");
});

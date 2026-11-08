import { testComponent } from "../testComponent.js";
import { arrayModel, ArrayModelView, component, store } from "steel-frame";

const modelStore = store(() => {
    const arr = arrayModel(["x"]);

    return {
        arr,
        addValue(value: string) {
            arr.push(value);
        },
        replaceValue(index: number, value: string) {
            arr.replace(index, value);
        },
    };
});

it("Store array model", function () {
    const [control, body] = testComponent(
        component(() => {
            <ArrayModelView
                of={modelStore.arr}
                slot={value => {
                    <div>Hello {value}!</div>;
                }}
            />;
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello x!");
    modelStore?.addValue("y");
    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("Hello x!");
    expect(body.children[1].innerHTML).toBe("Hello y!");
    modelStore?.addValue("z");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello x!");
    expect(body.children[1].innerHTML).toBe("Hello y!");
    expect(body.children[2].innerHTML).toBe("Hello z!");
    modelStore?.replaceValue(1, "a");
    expect(body.children.length).toBe(3);
    expect(body.children[0].innerHTML).toBe("Hello x!");
    expect(body.children[1].innerHTML).toBe("Hello a!");
    expect(body.children[2].innerHTML).toBe("Hello z!");
});

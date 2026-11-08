import { testComponent } from "../testComponent.js";
import { bypassWriteRestriction, component, store, watch } from "steel-frame";

const modelStore = store(() => {
    let wr_name = "Vasille";
    let $external = "test";

    watch(() => {
        bypassWriteRestriction(wr_name, "+" + $external);
    });

    return {
        $name: wr_name,
        $external,
        setValue(value: string) {
            $external = value;
        },
    };
});

it("Store watch call", function () {
    const [control, body] = testComponent(
        component(() => {
            <div>Hello {modelStore.$name}!</div>;
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello +test!");
    modelStore?.setValue("world");
    expect(body.children[0].innerHTML).toBe("Hello +world!");
});

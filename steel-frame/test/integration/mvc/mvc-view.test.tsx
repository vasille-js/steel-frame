import { testComponent } from "../testComponent.js";
import { component, ref } from "steel-frame";

interface Models {
    model: { $value: number };
}

let $value = ref(1);

export const control = {
    setValue(x: number) {
        $value = x;
    },
};

const MvcComponent = component((props: Models) => {
    const { model } = props;
    const { $value } = model;
    <div>{$value}</div>;
    <div>{$value + 2}</div>;
    return {};
});

it("MVC view call", function () {
    const [_control, body] = testComponent(
        component(() => {
            <MvcComponent model={{ $value }} />;
        }),
    );

    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("1");
    expect(body.children[1].innerHTML).toBe("3");
    control?.setValue(2);
    expect(body.children[0].innerHTML).toBe("2");
    expect(body.children[1].innerHTML).toBe("4");
});

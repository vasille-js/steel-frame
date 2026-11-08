import { testComponent } from "../testComponent.js";
import { component } from "steel-frame";

it("static component", function () {
    const [control, body] = testComponent(
        component(() => {
            <div>Hello world!</div>;
        }),
    );

    expect(body.children.length).toBe(1);
    expect(body.children[0].innerHTML).toBe("Hello world!");
});

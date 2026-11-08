import { testComponent } from "../testComponent.js";
import { component } from "steel-frame";

const Embed = component(() => {
    <div>Embed</div>;
});

it("static embed component", function () {
    const [control, body] = testComponent(
        component(() => {
            <div>Hello world!</div>;
            <Embed />;
        }),
    );

    expect(body.children.length).toBe(2);
    expect(body.children[0].innerHTML).toBe("Hello world!");
    expect(body.children[1].innerHTML).toBe("Embed");
});

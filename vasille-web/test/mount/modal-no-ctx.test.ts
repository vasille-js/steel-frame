import { modal } from "../../src/web/index.ts";
import { Slot } from "vasille";

const Modal = modal((node, { slot }) => {
    node.tag("div", { c: ["modal"] }, node => {
        Slot({ model: slot }, node);
    });
});

it("creates modal", function () {
    expect(() => {
        Modal({}, undefined);
    }).toThrow("Modal context is missing");
});

import { shadow } from "../src/lib.js";
import { shadowStyleSheet } from "../src/css.js";
import { page } from "./page.js";

const sheet = shadowStyleSheet({
    test: [
        "/*",
        ".{} { color: #000; display: flex }",
        [1, ".{} { color: #f00 }"],
        [2, ".{} { color: #0f0 }"],
        [3, ".{} { color: #00f }"],
        [4, ".{} { color: #ff0 }"],
        [5, ".{} { color: #0ff }"],
    ],
});

function registerFirst() {
    shadow(
        node => {
            node.tag("div", { c: ["first", sheet.test] });
        },
        "first-node",
        {},
    );
}

function registerSecond() {
    shadow(
        node => {
            node.tag("div", { c: ["second", sheet.test] });
        },
        "second-node",
        {},
    );
}

it("has injected styles", function () {
    const [body, window] = page();

    registerFirst();
    registerSecond();

    const first = window.document.createElement("first-node");

    body.appendChild(first);

    expect(first.shadowRoot!.innerHTML).toBe('<div class="first vasille-2"></div>');
    expect(first.shadowRoot!.adoptedStyleSheets.length).toBe(6);
    expect(first.shadowRoot!.adoptedStyleSheets[0].cssRules.length).toBe(1);
    expect(first.shadowRoot!.adoptedStyleSheets[0].cssRules[0].cssText.startsWith(".vasille-2 {")).toBe(true);
    expect((first.shadowRoot!.adoptedStyleSheets[0].cssRules[0] as any).style.display).toBe("flex");

    const second = window.document.createElement("second-node");
    const div = window.document.createElement("div");

    body.appendChild(second);
    body.appendChild(div);

    expect(second.shadowRoot!.adoptedStyleSheets).toEqual(first.shadowRoot!.adoptedStyleSheets);
    expect(second.shadowRoot!.innerHTML).toBe('<div class="second vasille-2"></div>');

    sheet.test.link(undefined);
    expect((div.className = sheet.test.inject())).toBe("vasille-2");
    expect(window.document.head.children.length).toBe(6);

    expect(window.getComputedStyle(div).display).toBe("flex");
    expect(window.getComputedStyle(first.shadowRoot!.firstElementChild!).display).toBe("flex");
    expect(window.getComputedStyle(second.shadowRoot!.firstElementChild!).display).toBe("flex");
});

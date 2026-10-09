import { JSDOM } from "jsdom";
import { mobileMaxWidth, laptopMaxWidth, styleSheet, tabletMaxWidth } from "../src/index.js";
import { DevCssStyleInjector, devSetLaptopMaxWidth, devSetMobileMaxWidth, devSetTabletMaxWidth } from "../src/dev.js";

function page() {
    const page = new JSDOM(`
        <html>
            <head>
            </head>
            <body>
            </body>
        </html>
    `);

    global.document = page.window.document;
    global.HTMLElement = page.window.HTMLElement;

    return page.window;
}

export function devStyleSheet<T extends { [k: string]: (string | [number, string])[] }>(
    styles: T,
): { [K in keyof T]: DevCssStyleInjector } {
    const result: { [k: string]: DevCssStyleInjector } = {};

    for (const key in styles) {
        result[key] = new DevCssStyleInjector(key, styles[key]);
    }

    return result as { [K in keyof T]: DevCssStyleInjector };
}

it("calculated style test", function () {
    devSetMobileMaxWidth(400);
    devSetTabletMaxWidth(800);
    devSetLaptopMaxWidth(1200);
    expect(mobileMaxWidth).toBe(400);
    expect(tabletMaxWidth).toBe(800);
    expect(laptopMaxWidth).toBe(1200);

    const window = page();
    const classes = styleSheet({
        test: [
            "/*",
            "{} { color: #000 }",
            [1, "{} { color: #f00 }"],
            [2, "{} { color: #0f0 }"],
            [3, "{} { color: #00f }"],
            [4, "{} { color: #ff0 }"],
            [5, "{} { color: #0ff }"],
        ],
    });
    const devStyles = devStyleSheet({
        test1: [
            "{} { color: #000 }",
            [1, "{} { color: #f00 }"],
            [2, "{} { color: #0f0 }"],
            [3, "{} { color: #00f }"],
            [4, "{} { color: #ff0 }"],
            [5, "{} { color: #0ff }"],
        ],
        testDev2: [],
    });

    expect(classes.test.inject()).toBe("vasille-2");
    expect(classes.test.inject()).toBe("vasille-2");
    expect(devStyles.test1.inject()).toBe("vasille-3-test1");
    expect(devStyles.testDev2.inject()).toBe("vasille-4-testDev2");

    function style(index: number) {
        return window.document.head.children[index] as unknown as { media: string; sheet: { media: string } };
    }

    expect(window.document.head.children.length).toBe(6);
    expect(style(0).media).toBe("");
    expect(style(1).media).toBe("(max-width:400px)");
    expect(style(2).media).toBe("(min-width:400px) and (max-width:800px)");
    expect(style(3).media).toBe("(min-width:800px) and (max-width:1200px)");
    expect(style(4).media).toBe("(prefers-color-scheme:dark)");
    expect(style(5).media).toBe("(prefers-color-scheme:light)");

    devSetMobileMaxWidth(300);
    devSetTabletMaxWidth(700);
    devSetLaptopMaxWidth(1100);
    expect(style(1).sheet.media).toBe("(max-width:300px)");
    expect(style(2).sheet.media).toBe("(min-width:300px) and (max-width:700px)");
    expect(style(3).sheet.media).toBe("(min-width:700px) and (max-width:1100px)");

    function sheet(index: number) {
        return window.document.styleSheets[index] as unknown as { cssRules: { style: { color: string } }[] };
    }

    expect(sheet(0).cssRules.length).toBe(2);
    expect(sheet(0).cssRules[0].style.color).toBe("#000");
    expect(sheet(1).cssRules.length).toBe(2);
    expect(sheet(1).cssRules[0].style.color).toBe("#f00");
    expect(sheet(2).cssRules.length).toBe(2);
    expect(sheet(2).cssRules[0].style.color).toBe("#0f0");
    expect(sheet(3).cssRules.length).toBe(2);
    expect(sheet(3).cssRules[0].style.color).toBe("#00f");
    expect(sheet(4).cssRules.length).toBe(2);
    expect(sheet(4).cssRules[0].style.color).toBe("#ff0");
    expect(sheet(5).cssRules.length).toBe(2);
    expect(sheet(5).cssRules[0].style.color).toBe("#0ff");
});

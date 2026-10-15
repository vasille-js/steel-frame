import { JSDOM } from "jsdom";
import { laptopMaxWidth, mobileMaxWidth, tabletMaxWidth } from "../../src/web/css/index.ts";
import { devSetLaptopMaxWidth, devSetMobileMaxWidth, devSetTabletMaxWidth } from "../../src/dev/css.ts";
import { devStyleSheet } from "../../src/dev/css-injector.ts";
import { StaticPosition } from "vasille/dev";

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

it("calculated style test", function () {
    const pos: StaticPosition = ["x", 1, 2, 3, 4];

    devSetMobileMaxWidth(400);
    devSetTabletMaxWidth(800);
    devSetLaptopMaxWidth(1200);
    expect(mobileMaxWidth).toBe(400);
    expect(tabletMaxWidth).toBe(800);
    expect(laptopMaxWidth).toBe(1200);

    const window = page();
    const classes = devStyleSheet({
        test: [
            [
                "/*",
                "{} { color: #000 }",
                [1, "{} { color: #f00 }"],
                [2, "{} { color: #0f0 }"],
                [3, "{} { color: #00f }"],
                [4, "{} { color: #ff0 }"],
                [5, "{} { color: #0ff }"],
            ],
            pos,
        ],
    });
    const devStyles = devStyleSheet({
        test1: [
            [
                "{} { color: #000 }",
                [1, "{} { color: #f00 }"],
                [2, "{} { color: #0f0 }"],
                [3, "{} { color: #00f }"],
                [4, "{} { color: #ff0 }"],
                [5, "{} { color: #0ff }"],
            ],
            pos,
        ],
        testDev2: [[], pos],
    });

    expect(classes.test.inject()).toBe("vasille-2-test");
    expect(classes.test.inject()).toBe("vasille-2-test");
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
    expect(style(1).sheet.media.toString()).toBe("(max-width:300px)");
    expect(style(2).sheet.media.toString()).toBe("(min-width:300px) and (max-width:700px)");
    expect(style(3).sheet.media.toString()).toBe("(min-width:700px) and (max-width:1100px)");

    function sheet(index: number) {
        return window.document.styleSheets[index] as unknown as { cssRules: { style: { color: string } }[] };
    }

    expect(sheet(0).cssRules.length).toBe(2);
    expect(sheet(0).cssRules[0].style.color).toBe("rgb(0, 0, 0)");
    expect(sheet(1).cssRules.length).toBe(2);
    expect(sheet(1).cssRules[0].style.color).toBe("rgb(255, 0, 0)");
    expect(sheet(2).cssRules.length).toBe(2);
    expect(sheet(2).cssRules[0].style.color).toBe("rgb(0, 255, 0)");
    expect(sheet(3).cssRules.length).toBe(2);
    expect(sheet(3).cssRules[0].style.color).toBe("rgb(0, 0, 255)");
    expect(sheet(4).cssRules.length).toBe(2);
    expect(sheet(4).cssRules[0].style.color).toBe("rgb(255, 255, 0)");
    expect(sheet(5).cssRules.length).toBe(2);
    expect(sheet(5).cssRules[0].style.color).toBe("rgb(0, 255, 255)");
});

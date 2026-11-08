import { testComponent } from "../testComponent.js";
import { component, dark, laptop, mobile, prefersDark, prefersLight, styleSheet, tablet, theme } from "steel-frame";

it("styled component", function () {
    const [control, body] = testComponent(
        component(() => {
            <div class={styles.common}></div>;
            <div class={styles.dark}></div>;
            <div class={styles.theme}></div>;
            <div class={styles.prefersLight}></div>;
            <div class={styles.prefersDark}></div>;
            <div class={styles.mobile}></div>;
            <div class={styles.tablet}></div>;
            <div class={styles.laptop}></div>;
        }),
    );
    const window = global.window;

    expect(body.children.length).toBe(8);

    // common
    expect(window.getComputedStyle(body.children[0]).margin).toBe("5px");
    expect(window.getComputedStyle(body.children[0]).padding).toBe("10px 5px");

    // dark
    expect(window.getComputedStyle(body.children[1]).background).toBe("rgb(255, 255, 255)");
    body.className = "dark";
    expect(window.getComputedStyle(body.children[1]).background).toBe("rgb(0, 0, 0)");

    // theme
    expect(window.getComputedStyle(body.children[2]).background).toBe("rgb(255, 255, 255)");
    body.className = "red";
    expect(window.getComputedStyle(body.children[2]).background).toBe("rgb(255, 0, 0)");
    body.className = "green";
    expect(window.getComputedStyle(body.children[2]).background).toBe("rgb(0, 128, 0)");

    // @media queries are ignored by jsdom, we cannot improve the next tests

    // prefers light
    expect(window.getComputedStyle(body.children[3]).background).toBe("rgb(255, 255, 255)");

    // prefers dark
    expect(window.getComputedStyle(body.children[4]).background).toBe("rgb(0, 0, 0)");

    // mobile
    expect(window.getComputedStyle(body.children[5]).margin).toBe("10px");

    // tablet
    expect(window.getComputedStyle(body.children[6]).margin).toBe("10px");

    // laptop
    expect(window.getComputedStyle(body.children[7]).margin).toBe("10px");
});

const styles = styleSheet({
    common: {
        margin: 5,
        padding: [10, 5],
        display: "block",
    },
    dark: {
        background: ["white", dark("black")],
    },
    theme: {
        background: ["white", theme("red", "red"), theme("green", "green")],
    },
    prefersLight: {
        background: ["grey", prefersLight("white")],
    },
    prefersDark: {
        background: ["grey", prefersDark("black")],
    },
    mobile: {
        margin: [5, mobile(10)],
    },
    tablet: {
        margin: [5, tablet(10)],
    },
    laptop: {
        margin: [5, laptop(10)],
    },
});

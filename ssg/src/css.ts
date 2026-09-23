import { Element, RawContentNode } from "./runner.js";
import { CssStyleInjector, laptopMaxWidth, mobileMaxWidth, tabletMaxWidth } from "vasille-css";

const styles: { rules: string[]; media(): string }[] & { length: 6 } = [
    { rules: [], media: () => "" },
    { rules: [], media: () => `(max-width:${mobileMaxWidth}px)` },
    { rules: [], media: () => `(min-width:${mobileMaxWidth}px) and (max-width:${tabletMaxWidth}px)` },
    { rules: [], media: () => `(min-width:${tabletMaxWidth}px) and (max-width:${laptopMaxWidth}px)` },
    { rules: [], media: () => "(prefers-color-scheme:dark)" },
    { rules: [], media: () => "(prefers-color-scheme:light)" },
];

class StaticCssStyleInjector extends CssStyleInjector {
    protected generateClassName(): string {
        return `${super.generateClassName()}-ssg`;
    }

    protected insertRule(rule: string | [number, string], className: string) {
        styles[typeof rule === "string" ? 0 : rule[0]].rules.push(
            (typeof rule === "string" ? rule : rule[1]).replace("{}", className),
        );
    }
}

const sheets: [{ [k: string]: (string | [number, string])[] }, { [k: string]: CssStyleInjector }][] = [];

function initStyleSheet(
    styles: { [k: string]: (string | [number, string])[] },
    result: { [k: string]: CssStyleInjector },
) {
    for (const key in styles) {
        result[key] = new StaticCssStyleInjector(styles[key]);
    }
}

export function styleSheet(styles: { [k: string]: (string | [number, string])[] }): { [k: string]: CssStyleInjector } {
    const result: { [k: string]: CssStyleInjector } = {};

    sheets.push([styles, result]);
    initStyleSheet(styles, result);

    return result;
}

export function mountStyles(head: Element) {
    for (const item of styles) {
        if (item.rules.length > 0) {
            const media = item.media();
            const style = new Element("style", { a: { media: media ? media : undefined } });

            style.appendChild(new RawContentNode(item.rules));
            head.appendChild(style);
            item.rules = [];
        }
    }

    // Reset all global states

    for (const args of sheets) {
        initStyleSheet(...args);
    }
}

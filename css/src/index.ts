import { insertRule } from "./lib.js";

export {
    setMobileMaxWidth,
    setTabletMaxWidth,
    setLaptopMaxWidth,
    mobileMaxWidth,
    tabletMaxWidth,
    laptopMaxWidth,
} from "./lib.js";

let index = 1;

export class CssStyleInjector {
    protected className: string | null = null;
    protected styles: (string | [number, string])[];

    public constructor(styles: (string | [number, string])[]) {
        this.styles = styles;
    }

    public inject(): string {
        if (this.className) {
            return this.className;
        }

        const className = this.generateClassName();

        for (const item of this.styles) {
            this.insertRule(item, className);
        }

        this.styles.splice(0);

        return (this.className = className);
    }

    protected generateClassName(): string {
        return `vasille-${++index}`;
    }

    protected insertRule(rule: string | [number, string], className: string) {
        if (rule instanceof Array) {
            insertRule(rule[0], rule[1].replace("{}", className));
        } else {
            insertRule(0, rule.replace("{}", className));
        }
    }
}

export class SafeCssStyleInjector extends CssStyleInjector {
    protected insertRule(rule: string | [number, string], className: string) {
        try {
            super.insertRule(rule, className);
        } catch (e) {
            // ignore any style related errors
            void e;
        }
    }
}

/**
 * Inserts stylesheet to document
 * @param styles CSS styles based on classes
 */
export function styleSheet<T extends { [k: string]: (string | [number, string])[] }>(
    styles: T,
): { [K in keyof T]: CssStyleInjector } {
    const result: { [k: string]: CssStyleInjector } = {};

    for (const key in styles) {
        result[key] = new SafeCssStyleInjector(styles[key]);
    }

    return result as { [K in keyof T]: CssStyleInjector };
}

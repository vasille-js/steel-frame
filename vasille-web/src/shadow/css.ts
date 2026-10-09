import { CssStyleInjector, laptopMaxWidth, mobileMaxWidth, tabletMaxWidth } from "vasille-css";

export class StyleSheetsManager {
    protected readonly sheets: CSSStyleSheet[] = [];
    protected readonly classes = new Set<string>();

    public addRoot(root: ShadowRoot) {
        /* istanbul ignore else */
        if (this.sheets.length === 0) {
            this.sheets.push(
                new CSSStyleSheet({ media: "" }),
                new CSSStyleSheet({ media: `(max-width:${mobileMaxWidth}px)` }),
                new CSSStyleSheet({ media: `(min-width:${mobileMaxWidth}px) and (max-width:${tabletMaxWidth}px)` }),
                new CSSStyleSheet({ media: `(min-width:${tabletMaxWidth}px) and (max-width:${laptopMaxWidth}px)` }),
                new CSSStyleSheet({ media: "(prefers-color-scheme:dark)" }),
                new CSSStyleSheet({ media: "(prefers-color-scheme:light)" }),
            );
        }
        root.adoptedStyleSheets = this.sheets;
    }

    public get(index: number): CSSStyleSheet | undefined {
        return this.sheets[index];
    }

    public has(className: string): boolean {
        const has = this.classes.has(className);

        this.classes.add(className);
        return has;
    }

    public add(className: string) {
        this.classes.add(className);
    }
}

export class ShadowCssStyleInjector extends CssStyleInjector {
    protected manager: StyleSheetsManager | undefined;
    protected staticName: string | null = null;
    protected rules: (string | [number, string])[];

    public constructor(rules: (string | [number, string])[]) {
        super(rules);
        this.rules = [...rules];
    }

    public link(manager?: StyleSheetsManager): void {
        /* istanbul ignore else */
        if (this.manager !== manager) {
            this.manager = manager;

            if (this.staticName && !manager?.has(this.staticName)) {
                this.className = null;
                /* istanbul ignore else */
                if (this.styles.length === 0) {
                    this.styles.push(...this.rules);
                }
            } else {
                this.className = this.staticName;
            }
        }
    }

    protected generateClassName(): string {
        const name = this.staticName ?? super.generateClassName();
        this.manager?.add(name);
        return (this.staticName = name);
    }

    protected insertRule(rule: string | [number, string], className: string) {
        const index = typeof rule === "string" ? 0 : rule[0];
        const value = typeof rule === "string" ? rule : rule[1];
        const sheet = this.manager?.get(index);

        try {
            if (sheet) {
                sheet.insertRule(value.replace("{}", className), sheet.cssRules.length);
            } else {
                super.insertRule(rule, className);
            }
        } catch (e) {
            // ignore css related errors
            void e;
        }
    }
}

export function shadowStyleSheet<T extends { [k: string]: (string | [number, string])[] }>(
    styles: T,
): { [K in keyof T]: ShadowCssStyleInjector } {
    const result: { [k: string]: ShadowCssStyleInjector } = {};

    for (const key in styles) {
        result[key] = new ShadowCssStyleInjector(styles[key]);
    }

    return result as { [K in keyof T]: ShadowCssStyleInjector };
}

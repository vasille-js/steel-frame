import { DevCssStyleInjector } from "vasille-css/dev";
import { inspector, StaticPosition } from "./inspectable.js";

let injectorId = 0;

export class InspectedCssStyleInjector extends DevCssStyleInjector {
    public readonly id: number;

    public constructor(key: string, rules: (string | [number, string])[], position: StaticPosition) {
        super(key, rules);

        const id = (this.id = ++injectorId);
        const name = this.inject();

        inspector.cssInjector({
            id: id,
            position: position,
            className: name,
            time: Date.now(),
        });
    }

    protected override insertRule(rule: string | [number, string], className: string) {
        let success = true;

        try {
            super.insertRule(rule, className);
        } catch (e) {
            success = false;
        }

        inspector.cssRule({ id: this.id, rule, success });
    }
}

export function devStyleSheet<T extends { [k: string]: [(string | [number, string])[], StaticPosition] }>(
    styles: T,
): { [K in keyof T]: InspectedCssStyleInjector } {
    const result: { [k: string]: InspectedCssStyleInjector } = {};

    for (const key in styles) {
        result[key] = new InspectedCssStyleInjector(
            key,
            ...(styles[key] as [(string | [number, string])[], StaticPosition]),
        );
    }

    return result as { [K in keyof T]: InspectedCssStyleInjector };
}

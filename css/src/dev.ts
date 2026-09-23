import { CssStyleInjector, setLaptopMaxWidth, setMobileMaxWidth, setTabletMaxWidth } from "./index.js";
import { desktop, laptopMaxWidth, mobile, mobileMaxWidth, tablet, tabletMaxWidth } from "./lib.js";

function warn(device: string) {
    console.warn(`[vasille-css] Setting of ${device} max width in production mode is not supported.`);
}

export function devSetMobileMaxWidth(value: number) {
    setMobileMaxWidth(value);
    if (mobile) {
        mobile.media = `(max-width:${mobileMaxWidth}px)`;
    }
    if (tablet) {
        tablet.media = `(min-width:${mobileMaxWidth}px) and (max-width:${tabletMaxWidth}px)`;
    }
    warn("mobile");
}

export function devSetTabletMaxWidth(value: number) {
    setTabletMaxWidth(value);
    if (tablet) {
        tablet.media = `(min-width:${mobileMaxWidth}px) and (max-width:${tabletMaxWidth}px)`;
    }
    if (desktop) {
        desktop.media = `(min-width:${tabletMaxWidth}px) and (max-width:${laptopMaxWidth}px)`;
    }
    warn("tablet");
}

export function devSetLaptopMaxWidth(value: number) {
    setLaptopMaxWidth(value);
    if (desktop) {
        desktop.media = `(min-width:${tabletMaxWidth}px) and (max-width:${laptopMaxWidth}px)`;
    }
    warn("laptop");
}

export class DevCssStyleInjector extends CssStyleInjector {
    protected key: string;

    public constructor(key: string, styles: (string | [number, string])[]) {
        super(styles);
        this.key = key;
    }

    protected generateClassName(): string {
        return `${super.generateClassName()}-${this.key}`;
    }
}

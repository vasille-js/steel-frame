import type { ObsoletePropertiesHyphen, StandardPropertiesHyphen, VendorPropertiesHyphen } from "csstype";

export type ElementStyleProps = StandardPropertiesHyphen<string | number | number[]> &
    VendorPropertiesHyphen<string | number | number[]> &
    ObsoletePropertiesHyphen<string | number | number[]> & { [variable: `--${string}`]: string };
export type StyleSheetProps = { [K in keyof ElementStyleProps]: ElementStyleProps[K] | ElementStyleProps[K][] };

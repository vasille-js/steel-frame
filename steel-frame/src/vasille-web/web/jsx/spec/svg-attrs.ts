import { ClassItem } from "../jsx-runtime.js";
import { CssStyleInjector } from "../../css/index.js";
import { AriaAttributes } from "./html-attrs.js";

type BlendMode =
    | "normal"
    | "multiply"
    | "screen"
    | "darken"
    | "lighten"
    | "overlay"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";

type LengthMetrics =
    | "cap"
    | "ch"
    | "em"
    | "ex"
    | "ic"
    | "lh"
    | "rcap"
    | "rch"
    | "rem"
    | "rex"
    | "ric"
    | "rlh"
    | "svw"
    | "svh"
    | "lvw"
    | "lwh"
    | "dvw"
    | "dvh"
    | "vw"
    | "vh"
    | "vi"
    | "vb"
    | "vmin"
    | "vmax";
type Percentage = `${number}%`;
type Length = `${number}${LengthMetrics}` | number;
type LengthPercentage = Length | Percentage;
type Angle = `${number}deg` | `${number}grad` | `${number}rad`;
type NumberOptionalNumber = number | `${number}` | `${number}, ${number}`;

type ClockValue =
    | number
    | `${number}:${number}`
    | `${number}:${number}.${number}`
    | `${number}:${number}:${number}`
    | `${number}:${number}:${number}.${number}`;

type Cursors =
    | "auto"
    | "crosshair"
    | "default"
    | "pointer"
    | "move"
    | "e-resize"
    | "ne-resize"
    | "nw-resize"
    | "n-resize"
    | "se-resize"
    | "sw-resize"
    | "s-resize"
    | "w-resize"
    | "text"
    | "wait"
    | "help";

interface AttributeName {
    "attribute-name": string;
}

interface AttributeType {
    "attribute-type": "CSS" | "XML" | "auto";
}

interface BaselineShift {
    "baseline-shift": "sub" | "super" | LengthPercentage;
}

interface Class {
    class: ClassItem[] | string | CssStyleInjector;
}

interface Clip {
    clip: string;
}

interface ClipPath extends Mask {
    "clip-path": string;
}

interface ClipRule {
    "clip-rule": "nonzero" | "evenodd" | "inherit";
}

interface ColorInterpolation {
    "color-interpolation": "auto" | "sRGB" | "linearRGB";
}

interface ColorInterpolationFilters extends Size {
    "color-interpolation-filters": "auto" | "sRGB" | "linearRGB";
}

interface Cursor {
    cursor: Cursors | "inherit" | `${string}, ${Cursors}`;
}

interface Fill {
    fill: string;
    "fill-opacity": number | Percentage;
}

interface FillRule {
    "fill-rule": "nonzero" | "evenodd";
}

interface Filter {
    filter: string;
}

interface Href {
    href: string;
    "xlink:href": string;
}

interface In {
    in: "SourceGraphic" | "SourceAlpha" | "BackgroundImage" | "BackgroundAlpha" | "FillPaint" | "StrokePaint" | string;
}

interface In2 {
    in2: "SourceGraphic" | "SourceAlpha" | "BackgroundImage" | "BackgroundAlpha" | "FillPaint" | "StrokePaint" | string;
}

interface Marker extends Stroke {
    "marker-end": string | "none";
    "marker-mid": string | "none";
    "marker-start": string | "none";
    pathLength: number;
}

interface Mask {
    mask: string;
}

interface Overflow {
    overflow: "visible" | "hidden" | "scroll" | "auto";
}

interface PointerEvents {
    "pointer-events":
        | "bounding-box"
        | "visiblePainted"
        | "visibleFill"
        | "visibleStroke"
        | "visible"
        | "painted"
        | "fill"
        | "stroke"
        | "all"
        | "none";
}

interface Size {
    width: LengthPercentage;
    height: LengthPercentage;
}

interface Stroke {
    "paint-order": "normal" | ("fill" | "stroke" | "markers")[];
}

// common attrs

interface Attrs extends AriaAttributes {
    autofocus: boolean;
    color: string;
    display: "none" | "inline";
    id: string;
    lang: string;
}

interface AnimateSetAttrs extends Attrs, Href {
    begin: string;
    dur: "media" | "indefinite" | ClockValue;
    end: string;
    keyPoints: string;
    max: ClockValue;
    min: ClockValue;
}

interface AnimateBaseAttrs extends AnimateSetAttrs {
    accumulate: "none" | "sum";
    additive: "replace" | "sum";
    by: string;
    calcMode: "discrete" | "linear" | "paced" | "spline";
    from: string;
    keySplines: string;
    keyTimes: string;
}

interface BaselineAttrs extends Stroke, Fill, FillRule, PointerEvents {
    "alignment-baseline":
        | "auto"
        | "baseline"
        | "before-edge"
        | "text-before-edge"
        | "middle"
        | "central"
        | "after-edge"
        | "text-after-edge"
        | "ideographic"
        | "alphabetic"
        | "hanging"
        | "mathematical"
        | "top"
        | "center"
        | "bottom";
    "dominant-baseline":
        | "auto"
        | "text-bottom"
        | "alphabetic"
        | "ideographic"
        | "middle"
        | "central"
        | "mathematical"
        | "hanging"
        | "text-top";
    "font-family": string;
    "font-size":
        | `${number}${LengthMetrics}`
        | Percentage
        | "xx-small"
        | "x-small"
        | "small"
        | "medium"
        | "large"
        | "x-large"
        | "xx-large"
        | "xxx-large"
        | "larger"
        | "smaller";
    "font-size-adjust": number | "none";
    "font-stretch":
        | "normal"
        | Percentage
        | "ultra-condensed"
        | "extra-condensed"
        | "condensed"
        | "semi-condensed"
        | "semi-expanded"
        | "expanded"
        | "extra-expanded"
        | "ultra-expanded";
    "font-style": "normal" | "italic" | "oblique";
    "font-variant": string;
    "font-weight": "normal" | "bold" | "bolder" | "lighter" | number;
    "font-width":
        | "normal"
        | Percentage
        | "ultra-condensed"
        | "extra-condensed"
        | "condensed"
        | "semi-condensed"
        | "semi-expanded"
        | "expanded"
        | "extra-expanded"
        | "ultra-expanded";
    "glyph-orientation-horizontal": Angle;
    "glyph-orientation-vertical": Angle | "auto";
    lengthAdjust: "spacing" | "spacingAndGlyphs";
    "letter-spacing": "normal" | Length;
    opacity: number;
}

interface ContainerAttrs extends Attrs, Class, ColorInterpolation, Cursor, Filter, Mask, PointerEvents {
    opacity: number;
}

interface FeFuncAttrs extends Attrs {
    amplitude: number;
    exponent: number;
    intercept: number;
    offset: number;
}

interface GradientAttrs extends Attrs, Href {
    gradientTransform: string;
    gradientUnits: "userSpaceOnUse" | "objectBoundingBox";
}

interface GraphicAttrs extends Attrs, Class, ClipPath, ClipRule, ColorInterpolation, Cursor, Filter, PointerEvents {
    opacity: number;
}

interface LightningAttrs extends Attrs {
    kernelUnitLength: NumberOptionalNumber;
    "lighting-color": string;
}

// real tags

interface AAttrs extends ContainerAttrs, ClipPath, ColorInterpolation, Href {
    download: string;
    hreflang: string;
}

interface AnimateAttrs extends AnimateBaseAttrs, AttributeName, AttributeType, ColorInterpolation {}

interface AnimateMotionAttrs extends AnimateBaseAttrs {
    origin: "default";
    path: string;
}

interface AnimateTransformAttrs extends AnimateBaseAttrs, AttributeName, AttributeType {}

interface CircleAttrs extends GraphicAttrs, Fill, Marker, Mask {
    cx: LengthPercentage;
    cy: LengthPercentage;
    r: LengthPercentage;
}

interface ClipPathAttrs extends Attrs, Class, ClipPath, ColorInterpolation, Mask, PointerEvents {
    clipPathUnits: "userSpaceOnUse" | "objectBoundingBox";
}

interface DefsAttrs extends Omit<ContainerAttrs, "filter"> {}

interface DescAttrs extends Attrs, Class {}

interface EllipseAttrs extends GraphicAttrs, Fill, Marker, Mask {
    cx: LengthPercentage;
    cy: LengthPercentage;
}

interface FeBlendAttrs extends Attrs, Class, ColorInterpolationFilters, In, In2 {
    mode: BlendMode;
}

interface FeColorMatrixAttrs extends Attrs, Class, ColorInterpolationFilters, In {}

interface FeComponentTransferAttrs extends Attrs, Class, ColorInterpolationFilters, In {}

interface FeCompositeAttrs extends Attrs, Class, ColorInterpolationFilters, In, In2 {
    k1: number;
    k2: number;
    k3: number;
    k4: number;
    operator: "over" | "in" | "out" | "atop" | "xor" | "lighter" | "arithmetic";
}

interface FeConvolveMatrixAttrs extends Attrs, Class, ColorInterpolationFilters, In {
    bias: number;
    divisor: number;
    edgeMode: "duplicate" | "wrap" | "none";
    kernelMatrix: number[] | string;
    kernelUnitLength: NumberOptionalNumber;
    order: NumberOptionalNumber;
    preserveAlpha: "true" | "false";
}

interface FeDiffuseLightingAttrs extends LightningAttrs, Class, ColorInterpolationFilters, In {
    diffuseConstant: number;
}

interface FeDistantLightAttrs extends Attrs {
    azimuth: number;
    elevation: number;
}

interface FeDisplacementMapAttrs extends Attrs, Class, ColorInterpolationFilters, In, In2 {}

interface FeDropShadowAttrs extends Attrs, ColorInterpolationFilters {
    dx: number;
    dy: number;
    "flood-color": string;
    "flood-opacity": number;
}

interface FeFloodAttrs extends Attrs, Class, ColorInterpolationFilters {
    "flood-color": string;
    "flood-opacity": number;
}

interface FeFuncAAttrs extends FeFuncAttrs {}

interface FeFuncBAttrs extends FeFuncAttrs {}

interface FeFuncGAttrs extends FeFuncAttrs {}

interface FeFuncRAttrs extends FeFuncAttrs {}

interface FeGaussianBlurAttrs extends Attrs, Class, ColorInterpolationFilters, In {
    edgeMode: "duplicate" | "wrap" | "none";
}

interface FeImageAttrs extends Attrs, Class, ColorInterpolationFilters, Href {
    crossorigin: "" | "anonymous" | "use-credentials";
    fetchpriority: "high" | "low" | "auto";
}

interface FeMergeAttrs extends Attrs, Class, ColorInterpolationFilters, In {}

interface FeMorphologyAttrs extends Attrs, Class, ColorInterpolationFilters, In {
    operator: "over" | "in" | "out" | "atop" | "xor" | "lighter" | "arithmetic";
}

interface FeOffsetAttrs extends Attrs, Class, ColorInterpolationFilters, In {
    dx: number;
    dy: number;
}

interface FeSpecularLightingAttrs extends LightningAttrs, Class, ColorInterpolationFilters, In {}

interface FeSpotLightAttrs extends Attrs {
    limitingConeAngle: number;
    pointsAtX: number;
    pointsAtY: number;
    pointsAtZ: number;
}

interface FeTileAttrs extends Attrs, Class, ColorInterpolationFilters, In {}

interface FeTurbulenceAttrs extends Attrs, Class, ColorInterpolationFilters {
    baseFrequency: NumberOptionalNumber;
    numOctaves: number;
}

interface FilterAttrs extends Attrs, Class, Size {
    filterUnits: "userSpaceOnUse" | "objectBoundingBox";
}

interface ForeignObjectAttrs extends Attrs, Class, Clip, ColorInterpolation, Size, Overflow, PointerEvents {
    opacity: number;
}

interface GAttrs extends ContainerAttrs, ClipPath {}

interface ImageAttrs extends GraphicAttrs, Clip, Size, Href, Mask, Overflow {
    crossorigin: "" | "anonymous" | "use-credentials";
    decoding: "auto" | "sync" | "async";
    fetchpriority: "high" | "low" | "auto";
    "image-rendering": "auto" | "optimizeSpeed" | "optimizeQuality";
}

interface LineAttrs extends GraphicAttrs, Marker {}

interface LinearGradientAttrs extends GradientAttrs, Class, ColorInterpolation {}

interface MarkerAttrs extends ContainerAttrs, Clip, ClipPath, Overflow {
    markerHeight: LengthPercentage;
    markerUnits: "userSpaceOnUse" | "objectBoundingBox";
    markerWidth: LengthPercentage;
    orient: "auto" | "auto-start-reverse" | number | Angle;
}

interface MaskAttrs extends ContainerAttrs, ClipPath, Size {
    "mask-type": "luminance" | "alpha";
    maskContentUnits: "userSpaceOnUse" | "objectBoundingBox";
    maskUnits: "userSpaceOnUse" | "objectBoundingBox";
}

interface MPath extends Attrs, Href {}

interface PathAttrs extends GraphicAttrs, Fill, FillRule, Marker, Mask {
    d: string;
}

interface PatternAttrs extends ContainerAttrs, Clip, ClipPath, Size, Href, Overflow {
    patternContentUnits: "userSpaceOnUse" | "objectBoundingBox";
    patternTransform: string;
    patternUnits: "userSpaceOnUse" | "objectBoundingBox";
}

interface PolygonAttrs extends GraphicAttrs, Fill, FillRule, Marker {
    points: string;
}

interface PolylineAttrs extends GraphicAttrs, Fill, FillRule, Marker {
    points: string;
}

interface RadialGradientAttrs extends GradientAttrs, Class, ColorInterpolation {
    cx: LengthPercentage;
    cy: LengthPercentage;
    fr: Percentage;
    fx: LengthPercentage;
    fy: LengthPercentage;
}

interface RectAttrs extends GraphicAttrs, Fill, Size, Marker {}

interface SetAttrs extends AttributeName, AttributeType, AnimateSetAttrs {
    begin: string;
}

interface StopAttrs extends Attrs, Class {
    offset: number | Percentage;
}

interface SvgAttrs extends ContainerAttrs, Clip, ClipPath, Size, Overflow {
    baseProfile: string;
}

interface SwitchAttrs extends ContainerAttrs {}

interface SymbolAttrs extends ContainerAttrs, Clip, ClipPath, Overflow {}

interface TextAttrs extends Attrs, BaselineAttrs, BaselineShift, ClipRule {
    direction: "ltr" | "rtl";
    dx: LengthPercentage | LengthPercentage[];
    dy: LengthPercentage | LengthPercentage[];
}

interface TextPathAttrs extends Attrs, BaselineAttrs, ClipPath, Href, Overflow {
    direction: "ltr" | "rtl";
    method: "align" | "stretch";
    path: string;
}

interface TitleAttrs extends Attrs, Class {}

interface TSpanAttrs extends Attrs, BaselineAttrs, BaselineShift {
    direction: "ltr" | "rtl";
    dx: LengthPercentage | LengthPercentage[];
    dy: LengthPercentage | LengthPercentage[];
}

interface UseAttrs extends GraphicAttrs, Size, Href, Mask {}

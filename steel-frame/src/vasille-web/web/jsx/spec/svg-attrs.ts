import { ClassItem } from "../jsx-runtime.js";
import { CssStyleInjector } from "../../css/index.js";
import { AriaAttributes, RelValue } from "./html-attrs.js";

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

type PreserveAspectRatioAlign =
    | "none"
    | "xMinYMin"
    | "xMidYMin"
    | "xMaxYMin"
    | "xMinYMid"
    | "xMidYMid"
    | "xMaxYMid"
    | "xMinYMax"
    | "xMidYMax"
    | "xMaxYMax";

type Units = "userSpaceOnUse" | "objectBoundingBox";

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
    result: string;
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
    "shape-rendering": "auto" | "optimizeSpeed" | "crispEdges" | "geometricPrecision";
    systemLanguage: string;
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

interface PAR {
    preserveAspectRatio:
        PreserveAspectRatioAlign | `${PreserveAspectRatioAlign} meet` | `${PreserveAspectRatioAlign} slice`;
}

interface RE {
    requiredExtensions: string;
    requiredFeatures: string;
    systemLanguage: string;
}

interface Size {
    height: LengthPercentage;
    width: LengthPercentage;
    x: LengthPercentage;
    y: LengthPercentage;
}

interface Stroke {
    "paint-order": "normal" | ("fill" | "stroke" | "markers")[];
    stroke: number;
    "stroke-dasharray": string | LengthPercentage[];
    "stroke-dashoffset": LengthPercentage;
    "stroke-linecap": "butt" | "round" | "square";
    "stroke-linejoin": "arcs" | "bevel" | "miter" | "miter-clip" | "round";
    "stroke-miterlimit": number;
    "stroke-opacity": number | Percentage;
    "stroke-width": LengthPercentage;
}

interface ViewBox {
    viewBox: string | number | number[];
}

interface Visibility {
    visibility: "visible" | "hidden" | "collapse";
}

// common attrs

interface Attrs extends AriaAttributes {
    autofocus: boolean;
    color: string;
    display: "none" | "inline";
    id: string;
    lang: string;
    tabindex: number;
    "text-overflow": "clip" | "ellipsis";
    title: string;
    transform: string | string[];
    "transform-origin":
        | "left"
        | "center"
        | "right"
        | "top"
        | "bottom"
        | LengthPercentage
        | `${LengthPercentage | "center" | "left" | "right"} ${LengthPercentage | "center" | "top" | "bottom"}`;
    "white-space": "normal" | "pre" | "nowrap" | "pre-wrap" | "break-space" | "pre-line";
}

interface AnimateSetAttrs extends Attrs, Href, RE {
    begin: string;
    dur: "media" | "indefinite" | ClockValue;
    end: string;
    keyPoints: string;
    max: ClockValue;
    min: ClockValue;
    repeatCount: number | "indefinite";
    repeatDur: ClockValue | "indefinite";
    restart: "always" | "never" | "whenNotActive";
    to: string;
    systemLanguage: string;
}

interface AnimateBaseAttrs extends AnimateSetAttrs {
    accumulate: "none" | "sum";
    additive: "replace" | "sum";
    by: string;
    calcMode: "discrete" | "linear" | "paced" | "spline";
    from: string;
    keySplines: string;
    keyTimes: string;
    values: string;
}

interface BaselineAttrs extends Stroke, Fill, FillRule, PointerEvents, RE, Visibility {
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
    "text-anchor": "start" | "middle" | "end";
    "text-decoration": string;
    textLength: LengthPercentage;
    "unicode-bidi": "normal" | "embed" | "isolate" | "bidi-override" | "isolate-override" | "plaintext";
    "vector-effect": "none" | "non-scaling-stroke" | "non-scaling-size" | "non-rotation" | "fixed-position";
    "word-spacing": Length | "normal";
    "writing-mode": "horizontal-tb" | "vertical-rl" | "vertical-lr";
}

interface ContainerAttrs extends Attrs, Class, ColorInterpolation, Cursor, Filter, Mask, PointerEvents, RE, Visibility {
    opacity: number;
}

interface FeFuncAttrs extends Attrs {
    amplitude: number;
    exponent: number;
    intercept: number;
    offset: number;
    slope: number;
    tableValues: number | number[];
    type: "identity" | "table" | "discrete" | "linear" | "gamma";
    x: LengthPercentage;
    y: LengthPercentage;
}

interface GradientAttrs extends Attrs, Href {
    gradientTransform: string;
    gradientUnits: Units;
    spreadMethod: "pad" | "reflect" | "repeat";
}

interface GraphicAttrs
    extends
        Attrs,
        Class,
        ClipPath,
        ClipRule,
        ColorInterpolation,
        Cursor,
        Filter,
        PointerEvents,
        Omit<RE, "systemLanguage">,
        Visibility {
    opacity: number;
    "vector-effect": "none" | "non-scaling-stroke" | "non-scaling-size" | "non-rotation" | "fixed-position";
}

interface LightningAttrs extends Attrs {
    kernelUnitLength: NumberOptionalNumber;
    "lighting-color": string;
    surfaceScale: number;
}

// real tags

export interface AAttrs extends ContainerAttrs, ClipPath, ColorInterpolation, Href {
    download: string;
    hreflang: string;
    referrerpolicy: ReferrerPolicy;
    rel: RelValue | RelValue[];
    systemLanguage: string;
    target: "_self" | "_parent" | "_top" | "_blank" | string;
    type: string;
}

export interface AnimateAttrs extends AnimateBaseAttrs, AttributeName, AttributeType, ColorInterpolation {}

export interface AnimateMotionAttrs extends AnimateBaseAttrs {
    origin: "default";
    path: string;
    rotate: number | "auto" | "auto-reverse";
}

export interface AnimateTransformAttrs extends AnimateBaseAttrs, AttributeName, AttributeType {
    type: "translate" | "scale" | "rotate" | "skewX" | "skewY";
}

export interface CircleAttrs extends GraphicAttrs, Fill, Marker, Mask {
    cx: LengthPercentage;
    cy: LengthPercentage;
    r: LengthPercentage;
}

export interface ClipPathAttrs extends Attrs, Class, ClipPath, ColorInterpolation, Mask, PointerEvents, RE {
    clipPathUnits: Units;
}

export interface DefsAttrs extends Omit<ContainerAttrs, "filter"> {}

export interface DescAttrs extends Attrs, Class {}

export interface EllipseAttrs extends GraphicAttrs, Fill, Marker, Mask {
    cx: LengthPercentage;
    cy: LengthPercentage;
    rx: LengthPercentage | "auto";
    ry: LengthPercentage | "auto";
}

export interface FeBlendAttrs extends Attrs, Class, ColorInterpolationFilters, In, In2 {
    mode: BlendMode;
}

export interface FeColorMatrixAttrs1 extends Attrs, Class, ColorInterpolationFilters, In {
    type: "matrix";
    values: number[];
}

export interface FeColorMatrixAttrs2 extends Attrs, Class, ColorInterpolationFilters, In {
    type: "saturate" | "hueRotate";
    values: number;
}

export interface FeColorMatrixAttrs3 extends Attrs, Class, ColorInterpolationFilters, In {
    type: "luminanceToAlpha";
}

export interface FeComponentTransferAttrs extends Attrs, Class, ColorInterpolationFilters, In {}

export interface FeCompositeAttrs extends Attrs, Class, ColorInterpolationFilters, In, In2 {
    k1: number;
    k2: number;
    k3: number;
    k4: number;
    operator: "over" | "in" | "out" | "atop" | "xor" | "lighter" | "arithmetic";
}

export interface FeConvolveMatrixAttrs extends Attrs, Class, ColorInterpolationFilters, In {
    bias: number;
    divisor: number;
    edgeMode: "duplicate" | "wrap" | "none";
    kernelMatrix: number[] | string;
    kernelUnitLength: NumberOptionalNumber;
    order: NumberOptionalNumber;
    preserveAlpha: "true" | "false";
    targetX: number;
    targetY: number;
}

export interface FeDiffuseLightingAttrs extends LightningAttrs, Class, ColorInterpolationFilters, In {
    diffuseConstant: number;
}

export interface FeDisplacementMapAttrs extends Attrs, Class, ColorInterpolationFilters, In, In2 {
    scale: number;
    xChannelSelector: "R" | "G" | "B" | "A";
}

export interface FeDistantLightAttrs extends Attrs {
    azimuth: number;
    elevation: number;
}

export interface FeDropShadowAttrs extends Attrs, ColorInterpolationFilters {
    dx: number;
    dy: number;
    "flood-color": string;
    "flood-opacity": number;
    stdDeviation: NumberOptionalNumber;
}

export interface FeFloodAttrs extends Attrs, Class, ColorInterpolationFilters {
    "flood-color": string;
    "flood-opacity": number;
}

export interface FeFuncAAttrs extends FeFuncAttrs {}

export interface FeFuncBAttrs extends FeFuncAttrs {}

export interface FeFuncGAttrs extends FeFuncAttrs {}

export interface FeFuncRAttrs extends FeFuncAttrs {}

export interface FeGaussianBlurAttrs extends Attrs, Class, ColorInterpolationFilters, In {
    edgeMode: "duplicate" | "wrap" | "none";
    stdDeviation: NumberOptionalNumber;
}

export interface FeImageAttrs extends Attrs, Class, ColorInterpolationFilters, Href, PAR {
    crossorigin: "" | "anonymous" | "use-credentials";
    fetchpriority: "high" | "low" | "auto";
}

export interface FeMergeAttrs extends Attrs, Class, ColorInterpolationFilters {}

export interface FeMergeNodeAttrs extends Attrs, In {}

export interface FeMorphologyAttrs extends Attrs, Class, ColorInterpolationFilters, In {
    operator: "over" | "in" | "out" | "atop" | "xor" | "lighter" | "arithmetic";
    radius: NumberOptionalNumber;
}

export interface FeOffsetAttrs extends Attrs, Class, ColorInterpolationFilters, In {
    dx: number;
    dy: number;
}

export interface FePointLightAttrs extends Attrs {
    x: number;
    y: number;
    z: number;
}

export interface FeSpecularLightingAttrs extends LightningAttrs, Class, ColorInterpolationFilters, In {
    specularConstant: number;
    specularExponent: number;
}

export interface FeSpotLightAttrs extends Attrs {
    limitingConeAngle: number;
    pointsAtX: number;
    pointsAtY: number;
    pointsAtZ: number;
    specularExponent: number;
    x: number;
    y: number;
    z: number;
}

export interface FeTileAttrs extends Attrs, Class, ColorInterpolationFilters, In {}

export interface FeTurbulenceAttrs extends Attrs, Class, ColorInterpolationFilters {
    baseFrequency: NumberOptionalNumber;
    numOctaves: number;
    seed: number;
    stitchTiles: "noStitch" | "stitch";
    type: "fractalNoise" | "turbulence";
}

export interface FilterAttrs extends Attrs, Class, Size {
    filterUnits: Units;
    primitiveUnits: Units;
}

export interface ForeignObjectAttrs
    extends Attrs, Class, Clip, ColorInterpolation, Size, Overflow, PointerEvents, RE, Visibility {
    opacity: number;
    systemLanguage: string;
    "vector-effect": "none" | "non-scaling-stroke" | "non-scaling-size" | "non-rotation" | "fixed-position";
}

export interface GAttrs
    extends
        ContainerAttrs,
        ClipPath,
        Marker,
        Fill,
        BaselineAttrs,
        BaselineShift,
        Clip,
        ClipRule,
        ColorInterpolation,
        ColorInterpolationFilters,
        Cursor,
        Filter,
        Overflow,
        Mask,
        Omit<GraphicAttrs, "requiredExtensions" | "requiredFeatures"> {}

export interface ImageAttrs extends GraphicAttrs, Clip, Size, Href, Mask, Overflow, PAR {
    crossorigin: "" | "anonymous" | "use-credentials";
    decoding: "auto" | "sync" | "async";
    fetchpriority: "high" | "low" | "auto";
    "image-rendering": "auto" | "optimizeSpeed" | "optimizeQuality";
    systemLanguage: string;
}

export interface LineAttrs extends GraphicAttrs, Marker {
    x1: LengthPercentage;
    x2: LengthPercentage;
    y1: LengthPercentage;
    y2: LengthPercentage;
}

export interface LinearGradientAttrs extends GradientAttrs, Class, ColorInterpolation {
    x1: LengthPercentage;
    x2: LengthPercentage;
    y1: LengthPercentage;
    y2: LengthPercentage;
}

export interface MarkerAttrs extends ContainerAttrs, Clip, ClipPath, Overflow, PAR, ViewBox {
    markerHeight: LengthPercentage;
    markerUnits: Units;
    markerWidth: LengthPercentage;
    orient: "auto" | "auto-start-reverse" | number | Angle;
    refX: LengthPercentage | "left" | "center" | "right";
    refY: LengthPercentage | "top" | "center" | "bottom";
}

export interface MaskAttrs extends ContainerAttrs, ClipPath, Size, ViewBox {
    "mask-type": "luminance" | "alpha";
    maskContentUnits: Units;
    maskUnits: Units;
}

export interface Metadata extends Attrs {}

export interface MPath extends Attrs, Href {
    systemLanguage: string;
}

export interface PathAttrs extends GraphicAttrs, Fill, FillRule, Marker, Mask {
    d: string;
}

export interface PatternAttrs extends ContainerAttrs, Clip, ClipPath, Size, Href, Overflow, PAR, ViewBox {
    patternContentUnits: Units;
    patternTransform: string;
    patternUnits: Units;
}

export interface PolygonAttrs extends GraphicAttrs, Fill, FillRule, Marker {
    points: string;
}

export interface PolylineAttrs extends GraphicAttrs, Fill, FillRule, Marker {
    points: string;
}

export interface RadialGradientAttrs extends GradientAttrs, Class, ColorInterpolation {
    cx: LengthPercentage;
    cy: LengthPercentage;
    fr: Percentage;
    fx: LengthPercentage;
    fy: LengthPercentage;
    r: Length;
}

export interface RectAttrs extends GraphicAttrs, Fill, Size, Marker {
    rx: LengthPercentage | "auto";
    ry: LengthPercentage | "auto";
}

export interface SetAttrs extends AttributeName, AttributeType, AnimateSetAttrs {}

export interface StopAttrs extends Attrs, Class {
    offset: number | Percentage;
    "stop-color": string;
    "stop-opacity": number;
}

export interface SvgAttrs extends ContainerAttrs, Clip, ClipPath, Size, Overflow, PAR, ViewBox {
    baseProfile: string;
    systemLanguage: string;
    version: "1.0" | "1.1";
    zoomAndPan: "magnify" | "disable";
}

export interface SwitchAttrs extends ContainerAttrs {
    systemLanguage: string;
}

export interface SymbolAttrs extends ContainerAttrs, Clip, ClipPath, Overflow, PAR, ViewBox {
    refX: Length | "left" | "center" | "right";
    refY: Length | "top" | "center" | "bottom";
}

export interface TextAttrs extends Attrs, BaselineAttrs, BaselineShift, ClipRule {
    direction: "ltr" | "rtl";
    dx: LengthPercentage | LengthPercentage[];
    dy: LengthPercentage | LengthPercentage[];
    rotate: number | number[];
    systemLanguage: string;
    "text-rendering": "auto" | "optimizeSpeed" | "optimizeLegibility" | "geometricPrecision";
}

export interface TextPathAttrs extends Attrs, BaselineAttrs, ClipPath, Href, Overflow {
    direction: "ltr" | "rtl";
    method: "align" | "stretch";
    path: string;
    side: "left" | "right";
    spacing: "auto" | "exact";
    startOffset: LengthPercentage;
    x: LengthPercentage;
    y: LengthPercentage;
}

export interface TitleAttrs extends Attrs, Class {}

export interface TSpanAttrs extends Attrs, BaselineAttrs, BaselineShift {
    direction: "ltr" | "rtl";
    dx: LengthPercentage | LengthPercentage[];
    dy: LengthPercentage | LengthPercentage[];
    rotate: number | number[];
    x: LengthPercentage;
    y: LengthPercentage;
}

export interface UseAttrs extends GraphicAttrs, Size, Href, Mask {
    systemLanguage: string;
}

export interface ViewAttrs extends Attrs, PAR, ViewBox {
    zoomAndPan: "magnify" | "disable";
}

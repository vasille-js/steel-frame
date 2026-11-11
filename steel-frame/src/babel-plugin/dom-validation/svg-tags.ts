type TagNames =
    | "a"
    | "animate"
    | "animateMotion"
    | "animateTransform"
    | "circle"
    | "clipPath"
    | "defs"
    | "desc"
    | "ellipse"
    | "feBlend"
    | "feColorMatrix"
    | "feComponentTransfer"
    | "feComposite"
    | "feConvolveMatrix"
    | "feDiffuseLighting"
    | "feDisplacementMap"
    | "feDistantLight"
    | "feDropShadow"
    | "feFlood"
    | "feFuncA"
    | "feFuncB"
    | "feFuncG"
    | "feFuncR"
    | "feGaussianBlur"
    | "feImage"
    | "feMerge"
    | "feMergeNode"
    | "feMorphology"
    | "feOffset"
    | "fePointLight"
    | "feSpecularLighting"
    | "feSpotLight"
    | "feTile"
    | "feTurbulence"
    | "filter"
    | "foreignObject"
    | "g"
    | "image"
    | "line"
    | "linearGradient"
    | "marker"
    | "mask"
    | "metadata"
    | "mpath"
    | "path"
    | "pattern"
    | "polygon"
    | "polyline"
    | "radialGradient"
    | "rect"
    | "script"
    | "set"
    | "stop"
    | "style"
    | "svg"
    | "switch"
    | "symbol"
    | "text"
    | "textPath"
    | "title"
    | "tspan"
    | "use"
    | "view";

const animations: TagNames[] = ["animate", "animateMotion", "animateTransform", "mpath", "set"];
const descriptive: TagNames[] = ["desc", "metadata", "title"];
const filters: TagNames[] = [
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "feSpecularLighting",
    "feTile",
    "feTurbulence",
];
const gradients: TagNames[] = ["linearGradient", "radialGradient", "stop"];
const lights: TagNames[] = ["feDistantLight", "fePointLight", "feSpotLight"];
const shapes: TagNames[] = ["circle", "ellipse", "line", "path", "polygon", "polyline", "rect"];
const structural: TagNames[] = ["defs", "g", "svg", "symbol", "use"];

const commonTags: TagNames[] = [
    ...animations,
    ...descriptive,
    ...shapes,
    ...structural,
    ...gradients,
    "a",
    "clipPath",
    "filter",
    "foreignObject",
    "image",
    "marker",
    "mask",
    "pattern",
    "script",
    "style",
    "switch",
    "text",
    "view",
];
const animationsDescriptive = [...animations, ...descriptive];

export const svgAcceptedChildren: { [key in TagNames]?: TagNames[] } = {
    animate: descriptive,
    animateMotion: [...descriptive, "mpath"],
    animateTransform: descriptive,
    circle: [...animationsDescriptive],
    clipPath: [...animationsDescriptive, ...shapes, "text", "use"],
    defs: commonTags,
    desc: [],
    ellipse: animationsDescriptive,
    feBlend: [],
    feColorMatrix: ["animate", "set"],
    feComponentTransfer: ["feFuncA", "feFuncB", "feFuncG", "feFuncR"],
    feComposite: ["animate", "set"],
    feConvolveMatrix: ["animate", "set"],
    feDiffuseLighting: [...descriptive, ...lights],
    feDisplacementMap: ["animate", "set"],
    feDistantLight: ["animate", "set"],
    feDropShadow: ["animate", "script", "set"],
    feFlood: ["animate", "set"],
    feFuncA: ["animate", "set"],
    feFuncB: ["animate", "set"],
    feFuncG: ["animate", "set"],
    feFuncR: ["animate", "set"],
    feGaussianBlur: ["animate", "set"],
    feImage: ["animate", "animateTransform", "set"],
    feMerge: ["feMergeNode"],
    feMergeNode: ["animate", "set"],
    feMorphology: ["animate", "set"],
    feOffset: ["animate", "set"],
    fePointLight: ["animate", "set"],
    feSpecularLighting: [...lights, ...descriptive],
    feSpotLight: ["animate", "set"],
    feTile: ["animate", "set"],
    feTurbulence: ["animate", "set"],
    filter: [...descriptive, ...filters, "animate", "set"],
    g: commonTags,
    image: [...animationsDescriptive, "animate", "animateMotion", "animateTransform", "script", "set", "style"],
    line: animationsDescriptive,
    linearGradient: [...descriptive, "animate", "animateTransform", "script", "set", "stop", "style"],
    marker: commonTags,
    mask: commonTags,
    mpath: descriptive,
    path: animationsDescriptive,
    pattern: commonTags,
    polygon: animationsDescriptive,
    polyline: animationsDescriptive,
    radialGradient: [...descriptive, "animate", "animateTransform", "script", "set", "stop", "style"],
    rect: animationsDescriptive,
    set: descriptive,
    stop: ["animate", "script", "set", "style"],
    svg: commonTags,
    switch: [
        ...animations,
        ...descriptive,
        ...shapes,
        "a",
        "foreignObject",
        "g",
        "image",
        "svg",
        "switch",
        "text",
        "use",
    ],
    symbol: commonTags,
    text: [...animations, ...descriptive, "a"],
    textPath: [...descriptive, "a", "animate", "set", "tspan"],
    tspan: [...descriptive, "a", "animate", "set", "tspan"],
    use: animationsDescriptive,
    view: descriptive,
};

import { Checker, IDomNode } from "./interfaces.js";

type TagNames =
    | "a"
    | "abbr"
    | "acronym"
    | "address"
    | "area"
    | "article"
    | "aside"
    | "audio"
    | "b"
    | "base"
    | "bdi"
    | "bdo"
    | "big"
    | "blockquote"
    | "body"
    | "br"
    | "button"
    | "canvas"
    | "caption"
    | "center"
    | "cite"
    | "code"
    | "col"
    | "colgroup"
    | "data"
    | "datalist"
    | "dd"
    | "del"
    | "details"
    | "dfn"
    | "dialog"
    | "dir"
    | "div"
    | "dl"
    | "dt"
    | "em"
    | "embed"
    | "fencedframe"
    | "fieldset"
    | "figcaption"
    | "figure"
    | "font"
    | "footer"
    | "form"
    | "frame"
    | "frameset"
    | "geolocation"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "head"
    | "header"
    | "hgroup"
    | "hr"
    | "html"
    | "i"
    | "iframe"
    | "img"
    | "input"
    | "ins"
    | "kbd"
    | "label"
    | "legend"
    | "li"
    | "link"
    | "main"
    | "map"
    | "mark"
    | "marquee"
    | "math"
    | "menu"
    | "meta"
    | "meter"
    | "nav"
    | "nobr"
    | "noembed"
    | "noframes"
    | "noscript"
    | "object"
    | "ol"
    | "optgroup"
    | "option"
    | "output"
    | "p"
    | "param"
    | "picture"
    | "plaintext"
    | "pre"
    | "progress"
    | "q"
    | "rb"
    | "rp"
    | "rt"
    | "rtc"
    | "ruby"
    | "s"
    | "samp"
    | "script"
    | "search"
    | "section"
    | "select"
    | "selectedcontent"
    | "slot"
    | "small"
    | "source"
    | "span"
    | "strike"
    | "strong"
    | "style"
    | "sub"
    | "summary"
    | "sup"
    | "svg"
    | "table"
    | "tbody"
    | "td"
    | "template"
    | "textarea"
    | "tfoot"
    | "th"
    | "thead"
    | "time"
    | "title"
    | "tr"
    | "track"
    | "tt"
    | "u"
    | "ul"
    | "var"
    | "video"
    | "wbr"
    | "xmp"
    | "-";

abstract class Checkable {
    public abstract check: (tag: IDomNode, chain: IDomNode[]) => boolean;
}

class AttributeCheck implements Checkable {
    public constructor(
        private readonly name: string,
        private readonly value: string,
        private readonly result: boolean,
    ) {}

    public check(tag: IDomNode): boolean {
        return (tag.attributes[this.name] === this.value) === this.result;
    }
}

class ChildrenCheck implements Checkable {
    public constructor(private readonly count: number) {}

    public check(tag: IDomNode): boolean {
        return tag.children.length >= this.count;
    }
}

const enum ExtraCondition {
    Phrasing = 0,
    Transparent = 1,
}
type AcceptedTag = TagNames | [TagNames, string | ExtraCondition | Checkable];
type AcceptedTags = AcceptedTag[];

const metadata: AcceptedTags = ["base", "link", "meta", "noscript", "script", "style", "template", "title"];

const flow: AcceptedTags = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "bdi",
    "bdo",
    "blockquote",
    "br",
    "button",
    "canvas",
    "cite",
    "code",
    "data",
    "datalist",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "em",
    "embed",
    "fieldset",
    "figure",
    "footer",
    "form",
    "geolocation",
    "h1",
    "h6",
    "header",
    "hgroup",
    "hr",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    ["link", "itemprop"],
    "main",
    "map",
    "mark",
    "math",
    "menu",
    ["meta", "itemprop"],
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "output",
    "p",
    "picture",
    "pre",
    "progress",
    "q",
    "ruby",
    "s",
    "samp",
    "script",
    "search",
    "section",
    "select",
    "slot",
    "small",
    "span",
    "strong",
    "style",
    "sub",
    "sup",
    "svg",
    "table",
    "template",
    "textarea",
    "time",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "-",
];

const sectioning: AcceptedTags = ["article", "aside", "nav", "section"];
const heading: AcceptedTags = ["h1", "h2", "h3", "h4", "h5", "h6", "hgroup"];
const phrasing: AcceptedTags = [
    ["a", ExtraCondition.Phrasing],
    "abbr",
    "area",
    "audio",
    "b",
    "bdi",
    "bdo",
    "br",
    "button",
    "canvas",
    "cite",
    "code",
    "data",
    "datalist",
    ["del", ExtraCondition.Phrasing],
    "dfn",
    "em",
    "embed",
    "i",
    "iframe",
    "img",
    "input",
    ["ins", ExtraCondition.Phrasing],
    "kbd",
    "label",
    ["link", "itemprop"],
    ["map", ExtraCondition.Phrasing],
    "mark",
    "math",
    ["meta", "itemprop"],
    "meter",
    "noscript",
    "object",
    "output",
    "picture",
    "progress",
    "q",
    "ruby",
    "s",
    "samp",
    "script",
    "select",
    "slot",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "svg",
    "template",
    "textarea",
    "time",
    "u",
    "var",
    "video",
    "wbr",
    "-",
];
const embedded: AcceptedTags = [
    "audio",
    "canvas",
    "embed",
    "iframe",
    "img",
    "math",
    "object",
    "picture",
    "svg",
    "video",
];
const interactive: AcceptedTags = [
    ["a", "href"],
    ["audio", "controls"],
    "button",
    "details",
    "embed",
    "iframe",
    ["img", "usemap"],
    ["input", new AttributeCheck("type", "hidden", false)],
    "label",
    ["object", "usemap"],
    "select",
    "textarea",
    ["video", "controls"],
];
const palpable: AcceptedTags = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    ["audio", "controls"],
    "b",
    "bdi",
    "bdo",
    "blockquote",
    "button",
    "canvas",
    "cite",
    "code",
    "data",
    "del",
    "details",
    "dfn",
    "div",
    ["dl", new ChildrenCheck(2)],
    "em",
    "embed",
    "fieldset",
    "figure",
    "footer",
    "form",
    "iframe",
    "img",
    ["input", new AttributeCheck("type", "hidden", false)],
    "ins",
    "kbd",
    "label",
    "li",
    "main",
    "map",
    "mark",
    "math",
    "meter",
    "nav",
    "object",
    ["ol", new ChildrenCheck(1)],
    "p",
    "picture",
    "pre",
    "progress",
    "q",
    "ruby",
    "s",
    "samp",
    "search",
    "section",
    "select",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "svg",
    "table",
    "textarea",
    "time",
    "u",
    ["ul", new ChildrenCheck(1)],
    "var",
    "video",
    "-",
];

type AcceptanceRule = AcceptedTags | ((tag: IDomNode, successors: IDomNode[]) => AcceptedTags | undefined) | Checkable;

interface AcceptData {
    noRecursion?: boolean;
    restrictedNode?: AcceptedTags;
    restrictedAttr?: string;
    rule?: AcceptanceRule;
    successor?: AcceptedTag;
    transparent?: boolean | Checker;
    check?(tag: IDomNode, chain: IDomNode[]): boolean;
}

class OrCheck {
    constructor(
        private readonly rule1: AcceptanceRule,
        private readonly rule2: AcceptanceRule,
    ) {}

    check(tag: IDomNode, chain: IDomNode[]): boolean {
        throw 1;
    }
}

export const htmlAcceptanceRules: { [key in TagNames]?: AcceptanceRule | AcceptData } = {
    a: { noRecursion: true, restrictedNode: interactive, restrictedAttr: "tabindex", transparent: true },
    abbr: phrasing,
    address: { noRecursion: true, rule: flow, restrictedNode: [...heading, ...sectioning, "header", "footer"] },
    area: { successor: "map", rule: [] },
    article: flow,
    aside: flow,
    audio: {
        restrictedNode: ["audio", "video"],
        rule: n => (n.attributes.src ? ["track"] : ["source", "track"]),
        transparent: true,
    },
    b: phrasing,
    base: [],
    bdi: phrasing,
    bdo: phrasing,
    blockquote: flow,
    body: flow,
    br: [],
    button: {
        restrictedNode: interactive,
        rule: (_, s) => (s[0].name === "select" ? [...flow, "selectedcontent"] : flow),
    },
    canvas: {
        restrictedNode: interactive.filter(item =>
            ["a", "button", "input"].includes(typeof item === "string" ? item : item[0]),
        ),
        transparent: true,
    },
    caption: flow,
    cite: phrasing,
    code: phrasing,
    col: [],
    colgroup: el => (el.attributes.span ? [] : ["col"]),
    data: phrasing,
    datalist: [...phrasing, "option"],
    dd: flow,
    del: { transparent: true },
    details: [...flow, "summary"],
    dfn: { rule: phrasing, noRecursion: true },
    dialog: flow,
    div: (_, s) => (s[0].name === "dl" ? ["dt", "dd", "script", "template"] : flow),
    dl: ["dt", "dd", "script", "template", "div"],
    dt: { rule: flow, restrictedNode: ["header", "footer"] },
    em: phrasing,
    embed: [],
    fieldset: [...flow, "legend"],
    figcaption: flow,
    figure: [...flow, "figcaption"],
    footer: { rule: flow, restrictedNode: ["header", "footer"] },
    form: { rule: flow, noRecursion: true },
    geolocation: { transparent: true },
    h1: phrasing,
    h2: phrasing,
    h3: phrasing,
    h4: phrasing,
    h5: phrasing,
    h6: phrasing,
    head: metadata,
    header: { rule: flow, restrictedNode: ["header", "footer"] },
    hgroup: [...heading, "p"],
    hr: [],
    html: ["head", "body"],
    i: phrasing,
    iframe: [],
    img: [],
    input: [],
    ins: { transparent: true },
    kbd: phrasing,
    label: {
        rule: phrasing,
        restrictedNode: [
            "button",
            ["input", new AttributeCheck("type", "hidden", false)],
            "meter",
            "output",
            "progress",
            "select",
            "textarea",
        ],
        noRecursion: true,
    },
    legend: [...phrasing, ...heading],
    li: flow,
    link: [],
    main: flow,
    map: { transparent: true },
    mark: phrasing,
    menu: ["li", "script", "template"],
    meta: [],
    meter: { rule: phrasing, noRecursion: true },
    nav: flow,
    noscript: {
        noRecursion: true,
        rule: (_, s) => (s.some(n => n.name === "head") ? ["link", "style", "meta"] : undefined),
        transparent: (_, s) => !s.some(n => n.name === "head"),
    },
    object: { rule: ["param"], transparent: true },
    ol: ["li", "script", "template"],
    optgroup: (_, s) => (s[0].children[0].name === "button" ? ["option", "legend"] : ["option"]),
    option: (_, s) => ((s[0].name === "select" ? s[0] : s[1])?.children[0]?.name === "button" ? flow : []),
    output: phrasing,
    p: phrasing,
    picture: ["source", "img"],
    pre: phrasing,
    progress: { noRecursion: true, rule: phrasing },
    q: phrasing,
    rp: [],
    rt: phrasing,
    rtc: [...phrasing, "rt"],
    ruby: { noRecursion: true, rule: new OrCheck(phrasing, ["rt", "rp"]) },
    s: phrasing,
    samp: phrasing,
    script: [],
    search: flow,
    section: flow,
    select: s =>
        s.attributes.multiple && s.attributes.size !== "1"
            ? ["div", "script", "noscript", "template"]
            : ["option", "optgroup", "hr", "button"],
    selectedcontent: [],
    slot: { transparent: true },
    small: phrasing,
    source: [],
    span: phrasing,
    strong: phrasing,
    style: [],
    sub: phrasing,
    summary: [...phrasing, ...heading],
    sup: phrasing,
    table: ["caption", "colgroup", "thead", "tbody", "tfoot", "tr"],
    tbody: ["tr"],
    td: flow,
    textarea: [],
    tfoot: ["tr"],
    th: { rule: flow, restrictedNode: [...sectioning, ...heading, "header", "footer"] },
    thead: ["tr"],
    time: phrasing,
    title: [],
    tr: ["th", "td", "script", "template"],
    track: [],
    tt: phrasing,
    u: phrasing,
    ul: ["li", "script", "template"],
    var: phrasing,
    video: {
        restrictedNode: ["audio", "video"],
        rule: n => (n.attributes.src ? ["track"] : ["source", "track"]),
        transparent: true,
    },
    wbr: [],
};

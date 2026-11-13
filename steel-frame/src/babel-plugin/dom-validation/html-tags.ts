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

const none: AcceptedTags = [];

const headerFooter: AcceptedTags = ["header", "footer"];
const addressRestricted: AcceptedTags = [...heading, ...sectioning, ...headerFooter];
const thRestricted: AcceptedTags = [...sectioning, ...heading, ...headerFooter];

const audioVideo: AcceptedTags = ["audio", "video"];
const trackOnly: AcceptedTags = ["track"];
const sourceTrack: AcceptedTags = ["source", "track"];

const flowSelectedContent: AcceptedTags = [...flow, "selectedcontent"];
const flowSummary: AcceptedTags = [...flow, "summary"];
const flowLegend: AcceptedTags = [...flow, "legend"];
const flowFigcaption: AcceptedTags = [...flow, "figcaption"];

const headingP: AcceptedTags = [...heading, "p"];
const phrasingOption: AcceptedTags = [...phrasing, "option"];
const phrasingRt: AcceptedTags = [...phrasing, "rt"];
const phrasingHeading: AcceptedTags = [...phrasing, ...heading];

const dtDdScriptTemplate: AcceptedTags = ["dt", "dd", "script", "template"];
const dtDdScriptTemplateDiv: AcceptedTags = [...dtDdScriptTemplate, "div"];
const liScriptTemplate: AcceptedTags = ["li", "script", "template"];
const trOnly: AcceptedTags = ["tr"];

const linkStyleMeta: AcceptedTags = ["link", "style", "meta"];
const rtRp: AcceptedTags = ["rt", "rp"];
const optionLegend: AcceptedTags = ["option", "legend"];
const optionOnly: AcceptedTags = ["option"];
const headBody: AcceptedTags = ["head", "body"];
const sourceImg: AcceptedTags = ["source", "img"];
const paramOnly: AcceptedTags = ["param"];
const colOnly: AcceptedTags = ["col"];
const tableContent: AcceptedTags = ["caption", "colgroup", "thead", "tbody", "tfoot", "tr"];
const selectMultiple: AcceptedTags = ["div", "script", "noscript", "template"];
const selectSingle: AcceptedTags = ["option", "optgroup", "hr", "button"];
const thTdScriptTemplate: AcceptedTags = ["th", "td", "script", "template"];
const canvasRestrictedNames: TagNames[] = ["a", "button", "input"];
const canvasRestrictedNodes: AcceptedTags = interactive.filter(item =>
    canvasRestrictedNames.includes(typeof item === "string" ? item : item[0]),
);
const labelRestricted: AcceptedTags = [
    "button",
    ["input", new AttributeCheck("type", "hidden", false)],
    "meter",
    "output",
    "progress",
    "select",
    "textarea",
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
    address: { noRecursion: true, rule: flow, restrictedNode: addressRestricted },
    area: { successor: "map", rule: none },
    article: flow,
    aside: flow,
    audio: {
        restrictedNode: audioVideo,
        rule: n => (n.attributes.src ? trackOnly : sourceTrack),
        transparent: true,
    },
    b: phrasing,
    base: none,
    bdi: phrasing,
    bdo: phrasing,
    blockquote: flow,
    body: flow,
    br: none,
    button: {
        restrictedNode: interactive,
        rule: (_, s) => (s[0].name === "select" ? flowSelectedContent : flow),
    },
    canvas: {
        restrictedNode: canvasRestrictedNodes,
        transparent: true,
    },
    caption: flow,
    cite: phrasing,
    code: phrasing,
    col: none,
    colgroup: el => (el.attributes.span ? none : colOnly),
    data: phrasing,
    datalist: phrasingOption,
    dd: flow,
    del: { transparent: true },
    details: flowSummary,
    dfn: { rule: phrasing, noRecursion: true },
    dialog: flow,
    div: (_, s) => (s[0].name === "dl" ? dtDdScriptTemplate : flow),
    dl: dtDdScriptTemplateDiv,
    dt: { rule: flow, restrictedNode: headerFooter },
    em: phrasing,
    embed: none,
    fieldset: flowLegend,
    figcaption: flow,
    figure: flowFigcaption,
    footer: { rule: flow, restrictedNode: headerFooter },
    form: { rule: flow, noRecursion: true },
    geolocation: { transparent: true },
    h1: phrasing,
    h2: phrasing,
    h3: phrasing,
    h4: phrasing,
    h5: phrasing,
    h6: phrasing,
    head: metadata,
    header: { rule: flow, restrictedNode: headerFooter },
    hgroup: headingP,
    hr: none,
    html: headBody,
    i: phrasing,
    iframe: none,
    img: none,
    input: none,
    ins: { transparent: true },
    kbd: phrasing,
    label: {
        rule: phrasing,
        restrictedNode: labelRestricted,
        noRecursion: true,
    },
    legend: phrasingHeading,
    li: flow,
    link: none,
    main: flow,
    map: { transparent: true },
    mark: phrasing,
    menu: liScriptTemplate,
    meta: none,
    meter: { rule: phrasing, noRecursion: true },
    nav: flow,
    noscript: {
        noRecursion: true,
        rule: (_, s) => (s.some(n => n.name === "head") ? linkStyleMeta : undefined),
        transparent: (_, s) => !s.some(n => n.name === "head"),
    },
    object: { rule: paramOnly, transparent: true },
    ol: liScriptTemplate,
    optgroup: (_, s) => (s[0].children[0].name === "button" ? optionLegend : optionOnly),
    option: (_, s) => ((s[0].name === "select" ? s[0] : s[1])?.children[0]?.name === "button" ? flow : none),
    output: phrasing,
    p: phrasing,
    picture: sourceImg,
    pre: phrasing,
    progress: { noRecursion: true, rule: phrasing },
    q: phrasing,
    rp: none,
    rt: phrasing,
    rtc: phrasingRt,
    ruby: { noRecursion: true, rule: new OrCheck(phrasing, rtRp) },
    s: phrasing,
    samp: phrasing,
    script: none,
    search: flow,
    section: flow,
    select: s => (s.attributes.multiple && s.attributes.size !== "1" ? selectMultiple : selectSingle),
    selectedcontent: none,
    slot: { transparent: true },
    small: phrasing,
    source: none,
    span: phrasing,
    strong: phrasing,
    style: none,
    sub: phrasing,
    summary: phrasingHeading,
    sup: phrasing,
    table: tableContent,
    tbody: trOnly,
    td: flow,
    textarea: none,
    tfoot: trOnly,
    th: { rule: flow, restrictedNode: thRestricted },
    thead: trOnly,
    time: phrasing,
    title: none,
    tr: thTdScriptTemplate,
    track: none,
    tt: phrasing,
    u: phrasing,
    ul: liScriptTemplate,
    var: phrasing,
    video: {
        restrictedNode: audioVideo,
        rule: n => (n.attributes.src ? trackOnly : sourceTrack),
        transparent: true,
    },
    wbr: none,
};

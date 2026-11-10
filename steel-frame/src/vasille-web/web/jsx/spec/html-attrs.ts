export type EventHandler<Event, Target> = (ev: Event, target: Target) => any;

export type RelValue =
    | "alternate"
    | "author"
    | "bookmark"
    | "canonical"
    | "compression-dictionary"
    | "dns-prefetch"
    | "external"
    | "expect"
    | "help"
    | "icon"
    | "license"
    | "manifest"
    | "me"
    | "modulepreload"
    | "next"
    | "nofollow"
    | "noopener"
    | "noreferrer"
    | "opener"
    | "pingback"
    | "preconnect"
    | "prefetch"
    | "preload"
    | "prerender"
    | "prev"
    | "privacy-policy"
    | "search"
    | "stylesheet"
    | "tag"
    | "terms-of-service";

export type AriaRoles =
    | "alert"
    | "alertdialog"
    | "application"
    | "article"
    | "banner"
    | "button"
    | "cell"
    | "checkbox"
    | "columnheader"
    | "combobox"
    | "command"
    | "comment"
    | "complementary"
    | "composite"
    | "contentinfo"
    | "definition"
    | "dialog"
    | "directory"
    | "document"
    | "feed"
    | "figure"
    | "form"
    | "generic"
    | "graphics-document"
    | "graphics-object"
    | "graphics-symbol"
    | "grid"
    | "gridcell"
    | "group"
    | "heading"
    | "img"
    | "input"
    | "landmark"
    | "link"
    | "list"
    | "listbox"
    | "listitem"
    | "log"
    | "main"
    | "mark"
    | "marquee"
    | "math"
    | "menu"
    | "menubar"
    | "menuitem"
    | "menuitemcheckbox"
    | "menuitemradio"
    | "meter"
    | "navigation"
    | "none"
    | "note"
    | "option"
    | "presentation"
    | "progressbar"
    | "radio"
    | "radiogroup"
    | "range"
    | "region"
    | "roletype"
    | "row"
    | "rowgroup"
    | "rowheader"
    | "scrollbar"
    | "search"
    | "searchbox"
    | "section"
    | "sectionhead"
    | "select"
    | "separator"
    | "slider"
    | "spinbutton"
    | "status"
    | "Structural"
    | "structure"
    | "suggestion"
    | "switch"
    | "tab"
    | "table"
    | "tablist"
    | "tabpanel"
    | "term"
    | "textbox"
    | "timer"
    | "toolbar"
    | "tooltip"
    | "tree"
    | "treegrid"
    | "treeitem"
    | "widget"
    | "window";

export type MediaEvents<Target> = {
    [K in keyof HTMLMediaElementEventMap]: EventHandler<HTMLMediaElementEventMap[K], Target> | undefined;
};

export type VideoEvents<Target> = {
    [K in keyof HTMLVideoElementEventMap]: EventHandler<HTMLVideoElementEventMap[K], Target> | undefined;
};

export type BodyEvents = {
    [K in keyof HTMLBodyElementEventMap]: EventHandler<HTMLBodyElementEventMap[K], HTMLBodyElement> | undefined;
};

export interface AAttrs extends TagAttrs {
    href: string;
    target: "_self" | "_blank" | "_parent" | "_top" | "_unfencedTop";
    download: string;
    ping: string;
    hreflang: string;
    type: string;
    referrerpolicy: ReferrerPolicy | string;
    rel: RelValue[] | string;
}

export interface AreaAttrs extends TagAttrs {
    alt: string;
    coords: string;
    shape: string;
    href: string;
    target: string;
    download: string;
    ping: string;
    rel: RelValue[] | string;
    referrerpolicy: ReferrerPolicy;
}

export interface AriaAttributes {
    "aria-activedescendant": string;
    "aria-atomic": "true" | "false";
    "aria-autocomplete": "none" | "inline" | "list" | "both";
    "aria-braillelabel": string;
    "aria-brailleroledescription": string;
    "aria-busy": "true" | "false";
    "aria-checked": "mixed" | "false" | "true";
    "aria-colcount": number;
    "aria-colindex": number;
    "aria-colindextext": string;
    "aria-colspan": number;
    "aria-controls": string;
    "aria-current": "page" | "step" | "location" | "date" | "time" | "true" | "false" | boolean;
    "aria-describedby": string;
    "aria-description": string;
    "aria-details": string;
    "aria-disabled": "true" | "false" | boolean;
    "aria-dropeffect": "none" | "link" | "copy" | "execute" | "move" | "popup";
    "aria-errormessage": string;
    "aria-expanded": "true" | "false" | boolean;
    "aria-flowto": string | string[];
    "aria-grabbed": "true" | "false" | boolean;
    "aria-haspopup": "true" | "false" | boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";
    "aria-hidden": "true" | "false" | boolean;
    "aria-invalid": "true" | "false" | boolean | "grammar" | "spelling";
    "aria-keyshortcuts": string | string[];
    "aria-label": string;
    "aria-labelledby": string | string[];
    "aria-level": number;
    "aria-live": "off" | "assertive" | "polite";
    "aria-modal": "true" | "false" | boolean;
    "aria-multiline": "true" | "false" | boolean;
    "aria-multiselectable": "true" | "false" | boolean;
    "aria-orientation": "horizontal" | "vertical";
    "aria-owns": string | string[];
    "aria-placeholder": string;
    "aria-posinset": number;
    "aria-pressed": "true" | "false" | boolean | "mixed";
    "aria-readonly": "true" | "false" | boolean;
    "aria-relevant": "additions" | "additions text" | "all" | "additions removals text" | "removals" | "text";
    "aria-required": "true" | "false" | boolean;
    "aria-roledescription": string;
    "aria-rowcount": number;
    "aria-rowindex": number;
    "aria-rowindextext": string;
    "aria-rowspan": number;
    "aria-selected": "true" | "false" | boolean;
    "aria-setsize": number;
    "aria-sort": "none" | "ascending" | "descending" | "other";
    "aria-valuemax": number;
    "aria-valuemin": number;
    "aria-valuenow": number;
    "aria-valuetext": string;
}

export interface BaseAttrs extends TagAttrs {
    href: string;
    target: string;
}

export interface BdoAttrs extends TagAttrs {
    dir: "ltr" | "rtl";
}

export interface BlockQuoteAttrs extends TagAttrs {
    cite: string;
}

export interface ButtonAttrs extends TagAttrs {
    disabled: boolean;
    form: string;
    formaction: string;
    formenctype: string;
    formmethod: string;
    formnovalidate: string;
    formtarget: string;
    name: string;
    type: string;
    value: string;
}

export interface CanvasAttrs extends TagAttrs {
    width: number;
    height: number;
}

export interface ColAttrs extends TagAttrs {
    span: number;
}

export interface DataAttr extends TagAttrs {
    value: string;
}

export interface DetailsAttrs extends TagAttrs {
    open: boolean;
}

export interface EmbedAttrs extends TagAttrs {
    src: string;
    type: string;
    width: number;
    height: number;
}

export interface FieldsetAttrs extends TagAttrs {
    disabled: boolean;
    form: string;
    name: string;
}

export interface FormAttrs extends TagAttrs {
    "accept-charset": string;
    action: string;
    autocomplete: string;
    enctype: string;
    method: string;
    name: string;
    novalidate: string;
    target: string;
    rel: RelValue[] | string;
}

export interface IframeAttrs extends TagAttrs {
    src: string;
    srcdoc: string;
    name: string;
    sandbox: string;
    allow: string;
    allowfullscreen: string;
    width: number;
    height: number;
    referrerpolicy: ReferrerPolicy;
    loading: string;
}

export interface ImgAttrs extends TagAttrs {
    alt: string;
    src: string;
    srcset: string;
    sizes: string;
    crossorigin: "anonymous" | "use-credentials" | "" | boolean;
    usemap: string;
    ismap: string;
    width: number;
    height: number;
    referrerpolicy: ReferrerPolicy | string;
    decoding: string;
    loading: string;
    fetchpriority: "high" | "low" | "auto";
}

export interface InputAttrs extends TagAttrs {
    accept: string;
    alt: string;
    autocomplete: boolean;
    checked: boolean;
    dirname: string;
    disabled: boolean;
    form: string;
    formaction: string;
    formenctype: string;
    formmethod: string;
    formnovalidate: string;
    formtarget: string;
    height: number;
    list: string;
    max: number;
    maxlength: number;
    min: number;
    minlength: number;
    multiple: boolean;
    name: string;
    pattern: string;
    placeholder: string;
    readonly: string;
    required: string;
    size: number;
    src: string;
    step: string;
    type: string;
    value: string;
    width: number;
}

export interface LabelAttrs extends TagAttrs {
    for: string;
}

export interface LinkAttrs extends TagAttrs {
    href: string;
    crossorigin: "anonymous" | "use-credentials" | "" | boolean;
    rel: RelValue[] | string;
    media: string;
    integrity: string;
    hreflang: string;
    type: string;
    referrerpolicy: ReferrerPolicy | string;
    sizes: string;
    imagesrcset: string;
    imagesizes: string;
    as: string;
    blocking: boolean;
    color: string;
}

export interface MapAttrs extends TagAttrs {
    name: string;
}

export interface MediaTagAttrs extends TagAttrs {
    src: string;
    crossorigin: "anonymous" | "use-credentials" | "" | boolean;
    preload: "none" | "metadata" | "auto";
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    controls: boolean;
}

export interface MetaAttrs extends TagAttrs {
    name: string;
    "http-equiv": string;
    content: string;
    charset: string;
    media: string;
}

export interface MeterAttrs extends TagAttrs {
    value: number;
    min: number;
    max: number;
    low: number;
    high: number;
    optimum: number;
}

export interface ObjectAttrs extends TagAttrs {
    data: string;
    type: string;
    name: string;
    form: string;
    width: number;
    height: number;
}

export interface OlAttrs extends TagAttrs {
    reversed: boolean;
    start: number;
    type: "1" | "a" | "A" | "i" | "I";
}

export interface OptgroupAttrs extends TagAttrs {
    disabled: boolean;
    label: string;
}

export interface OptionAttrs extends TagAttrs {
    disabled: boolean;
    label: string;
    selected: boolean;
    value: string;
}

export interface OutputAttrs extends TagAttrs {
    for: string;
    form: string;
    name: string;
}

export interface ProgressAttrs extends TagAttrs {
    value: number;
    max: number;
}

export interface QAttrs extends TagAttrs {
    cite: string;
}

export interface SelectAttrs extends TagAttrs {
    autocomplete: boolean;
    disabled: boolean;
    form: string;
    multiple: boolean;
    name: string;
    required: boolean;
    size: number;
}

export interface SourceAttrs extends TagAttrs {
    type: string;
    src: string;
    srcset: string;
    sizes: string;
    media: string;
    width: number;
    height: number;
}

export interface StyleAttrs extends TagAttrs {
    media: string;
    blocking: string;
}

export interface TagAttrs extends AriaAttributes {
    id: string;
    accesskey: string;
    autocapitalize: "off" | "none" | "on" | "sentences" | "words" | "characters";
    autofocus: "" | boolean;
    contenteditable: "true" | "false" | "" | boolean;
    dir: "ltr" | "rtl" | "auto";
    draggable: "true" | "false" | "" | boolean;
    enterkeyhint: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
    hidden: "until-found" | "hidden" | "" | boolean;
    inert: boolean;
    inputmode: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
    is: string;
    itemid: string;
    itemprop: string;
    itemref: string;
    itemscope: boolean;
    itemtype: string;
    lang: string;
    nonce: string;
    part: string;
    role: AriaRoles | string;
    slot: string;
    spellcheck: "true" | "false" | "" | boolean;
    tabindex: number;
    title: string;
    translate: "yes" | "no" | "" | boolean;
}

export interface TdAttrs extends TagAttrs {
    colspan: number;
    rowspan: number;
    headers: string;
}

export interface TextareaAttrs extends TagAttrs {
    autocomplete: boolean;
    cols: number;
    dirname: string;
    disabled: boolean;
    form: string;
    maxlength: number;
    minlength: number;
    name: string;
    placeholder: string;
    readonly: boolean;
    required: boolean;
    rows: number;
    wrap: string;
}

export interface ThAttrs extends TdAttrs {
    scope: string;
    abbr: string;
}

export interface TrackAttrs extends TagAttrs {
    kind: string;
    src: string;
    srclang: string;
    label: string;
    defautl: boolean;
}

export interface VideoAttrs extends MediaTagAttrs {
    poster: string;
    playsinline: boolean;
    width: number;
    height: number;
}

import {
    AAttrs,
    AreaAttrs,
    BaseAttrs,
    BdoAttrs,
    BlockQuoteAttrs,
    BodyEvents,
    ButtonAttrs,
    CanvasAttrs,
    ColAttrs,
    DataAttr,
    DetailsAttrs,
    EmbedAttrs,
    EventHandler,
    FieldsetAttrs,
    FormAttrs,
    IframeAttrs,
    ImgAttrs,
    InputAttrs,
    LabelAttrs,
    LinkAttrs,
    MapAttrs,
    MediaEvents,
    MediaTagAttrs,
    MetaAttrs,
    MeterAttrs,
    ObjectAttrs,
    OlAttrs,
    OptgroupAttrs,
    OptionAttrs,
    OutputAttrs,
    ProgressAttrs,
    QAttrs,
    SelectAttrs,
    SourceAttrs,
    StyleAttrs,
    TagAttrs,
    TdAttrs,
    TextareaAttrs,
    ThAttrs,
    TrackAttrs,
    VideoAttrs,
    VideoEvents,
} from "./html-attrs.js";
import {
    AnchorProps,
    AreaProps,
    BaseProps,
    ButtonProps,
    CanvasProps,
    DataProps,
    DetailsProps,
    EmbedProps,
    FieldSetProps,
    FormProps,
    IFrameProps,
    ImageProps,
    InputProps,
    LabelProps,
    LinkProps,
    LiProps,
    MapProps,
    MediaProps,
    MeterProps,
    ModProps,
    ObjectProps,
    OListProps,
    OptGroupProps,
    OptionProps,
    OutputProps,
    ProgressProps,
    QuoteProps,
    ScriptProps,
    SelectProps,
    SlotProps,
    SourceProps,
    StyleProps,
    TableCellProps,
    TableColProps,
    TableProps,
    TagProps,
    TextAreaProps,
    TimeProps,
    TitleProps,
    TrackProps,
    VideoProps,
} from "./html-properties.js";

export interface Tag<Attrs, Events, Props> {
    attrs: Attrs;
    events: Events;
    props: Props;
}

export type TagEvents<Target> = {
    [K in keyof HTMLElementEventMap]: EventHandler<HTMLElementEventMap[K], Target> | undefined;
};

export interface HtmlTagMap {
    a: Tag<AAttrs, TagEvents<HTMLAnchorElement>, AnchorProps>;
    abbr: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    address: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    area: Tag<AreaAttrs, TagEvents<HTMLAreaElement>, AreaProps>;
    article: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    aside: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    audio: Tag<MediaTagAttrs, MediaEvents<HTMLAudioElement>, MediaProps<HTMLAudioElement>>;
    b: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    base: Tag<BaseAttrs, TagEvents<HTMLBaseElement>, BaseProps>;
    bdi: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    bdo: Tag<BdoAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    blockquote: Tag<BlockQuoteAttrs, TagEvents<HTMLQuoteElement>, QuoteProps>;
    body: Tag<TagAttrs, BodyEvents, TagProps<HTMLBodyElement>>;
    br: Tag<TagAttrs, TagEvents<HTMLBRElement>, TagProps<HTMLBRElement>>;
    button: Tag<ButtonAttrs, TagEvents<HTMLButtonElement>, ButtonProps>;
    canvas: Tag<CanvasAttrs, TagEvents<HTMLCanvasElement>, CanvasProps>;
    caption: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    cite: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    code: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    col: Tag<ColAttrs, TagEvents<HTMLTableColElement>, TableColProps>;
    colgroup: Tag<ColAttrs, TagEvents<HTMLTableColElement>, TableColProps>;
    data: Tag<DataAttr, TagEvents<HTMLDataElement>, DataProps>;
    datalist: Tag<TagAttrs, TagEvents<HTMLDataListElement>, TagProps<HTMLDataListElement>>;
    dd: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    del: Tag<TagAttrs, TagEvents<HTMLModElement>, ModProps<HTMLModElement>>;
    details: Tag<DetailsAttrs, TagEvents<HTMLDetailsElement>, DetailsProps>;
    dfn: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    dialog: Tag<TagAttrs, TagEvents<HTMLDialogElement>, TagProps<HTMLDialogElement>>;
    dir: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    div: Tag<TagAttrs, TagEvents<HTMLDivElement>, TagProps<HTMLDivElement>>;
    dl: Tag<TagAttrs, TagEvents<HTMLDListElement>, TagProps<HTMLDListElement>>;
    dt: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    em: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    embed: Tag<EmbedAttrs, TagEvents<HTMLEmbedElement>, EmbedProps>;
    fieldset: Tag<FieldsetAttrs, TagEvents<HTMLFieldSetElement>, FieldSetProps>;
    figcaption: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    figure: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    font: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    footer: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    form: Tag<FormAttrs, TagEvents<HTMLFormElement>, FormProps>;
    h1: Tag<TagAttrs, TagEvents<HTMLHeadingElement>, TagProps<HTMLHeadingElement>>;
    h2: Tag<TagAttrs, TagEvents<HTMLHeadingElement>, TagProps<HTMLHeadingElement>>;
    h3: Tag<TagAttrs, TagEvents<HTMLHeadingElement>, TagProps<HTMLHeadingElement>>;
    h4: Tag<TagAttrs, TagEvents<HTMLHeadingElement>, TagProps<HTMLHeadingElement>>;
    h5: Tag<TagAttrs, TagEvents<HTMLHeadingElement>, TagProps<HTMLHeadingElement>>;
    h6: Tag<TagAttrs, TagEvents<HTMLHeadingElement>, TagProps<HTMLHeadingElement>>;
    head: Tag<TagAttrs, TagEvents<HTMLHeadElement>, TagProps<HTMLHeadElement>>;
    header: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    hgroup: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    hr: Tag<TagAttrs, TagEvents<HTMLHRElement>, TagProps<HTMLHRElement>>;
    i: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    iframe: Tag<IframeAttrs, TagEvents<HTMLIFrameElement>, IFrameProps>;
    img: Tag<ImgAttrs, TagEvents<HTMLImageElement>, ImageProps>;
    input: Tag<InputAttrs, TagEvents<HTMLInputElement>, InputProps>;
    ins: Tag<TagAttrs, TagEvents<HTMLModElement>, ModProps<HTMLModElement>>;
    kbd: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    label: Tag<LabelAttrs, TagEvents<HTMLLabelElement>, LabelProps>;
    legend: Tag<TagAttrs, TagEvents<HTMLLegendElement>, TagProps<HTMLLegendElement>>;
    li: Tag<TagAttrs, TagEvents<HTMLLIElement>, LiProps>;
    link: Tag<LinkAttrs, TagEvents<HTMLLinkElement>, LinkProps>;
    main: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    map: Tag<MapAttrs, TagEvents<HTMLMapElement>, MapProps>;
    mark: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    menu: Tag<TagAttrs, TagEvents<HTMLMenuElement>, TagProps<HTMLMenuElement>>;
    meta: Tag<MetaAttrs, TagEvents<HTMLMetaElement>, TagProps<HTMLMetaElement>>;
    meter: Tag<MeterAttrs, TagEvents<HTMLMeterElement>, MeterProps>;
    nav: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    noscript: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    object: Tag<ObjectAttrs, TagEvents<HTMLObjectElement>, ObjectProps>;
    ol: Tag<OlAttrs, TagEvents<HTMLOListElement>, OListProps>;
    optgroup: Tag<OptgroupAttrs, TagEvents<HTMLOptGroupElement>, OptGroupProps>;
    option: Tag<OptionAttrs, TagEvents<HTMLOptionElement>, OptionProps>;
    output: Tag<OutputAttrs, TagEvents<HTMLOutputElement>, OutputProps>;
    p: Tag<TagAttrs, TagEvents<HTMLParagraphElement>, TagProps<HTMLParagraphElement>>;
    picture: Tag<TagAttrs, TagEvents<HTMLPictureElement>, TagProps<HTMLPictureElement>>;
    pre: Tag<TagAttrs, TagEvents<HTMLPreElement>, TagProps<HTMLPreElement>>;
    progress: Tag<ProgressAttrs, TagEvents<HTMLProgressElement>, ProgressProps>;
    q: Tag<QAttrs, TagEvents<HTMLQuoteElement>, QuoteProps>;
    rp: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    rt: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    ruby: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    s: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    samp: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    script: Tag<TagAttrs, TagEvents<HTMLScriptElement>, ScriptProps>;
    section: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    select: Tag<SelectAttrs, TagEvents<HTMLSelectElement>, SelectProps>;
    slot: Tag<TagAttrs, TagEvents<HTMLSlotElement>, SlotProps>;
    small: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    source: Tag<SourceAttrs, TagEvents<HTMLSourceElement>, SourceProps>;
    span: Tag<TagAttrs, TagEvents<HTMLSpanElement>, TagProps<HTMLSpanElement>>;
    strong: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    style: Tag<StyleAttrs, TagEvents<HTMLStyleElement>, StyleProps>;
    sub: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    summary: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    sup: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    table: Tag<TagAttrs, TagEvents<HTMLTableElement>, TableProps>;
    tbody: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    td: Tag<TdAttrs, TagEvents<HTMLTableCellElement>, TableCellProps>;
    template: Tag<TagAttrs, TagEvents<HTMLTemplateElement>, TagProps<HTMLTemplateElement>>;
    textarea: Tag<TextareaAttrs, TagEvents<HTMLTextAreaElement>, TextAreaProps>;
    tfoot: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    th: Tag<ThAttrs, TagEvents<HTMLTableCellElement>, TableCellProps>;
    thead: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    time: Tag<TagAttrs, TagEvents<HTMLTimeElement>, TimeProps>;
    title: Tag<TagAttrs, TagEvents<HTMLTitleElement>, TitleProps>;
    tr: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    track: Tag<TrackAttrs, TagEvents<HTMLTrackElement>, TrackProps>;
    u: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    ul: Tag<TagAttrs, TagEvents<HTMLUListElement>, TagProps<HTMLUListElement>>;
    var: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
    video: Tag<VideoAttrs, VideoEvents<HTMLVideoElement>, VideoProps>;
    wbr: Tag<TagAttrs, TagEvents<HTMLElement>, TagProps<HTMLElement>>;
}

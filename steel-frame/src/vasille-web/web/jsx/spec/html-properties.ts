export interface AnchorProps extends TagProps<HTMLAnchorElement> {
    download: string;
    hreflang: string;
    ping: string;
    referrerPolicy: ReferrerPolicy | string;
    rel: string;
    target: "_self" | "_blank" | "_parent" | "_top" | "_unfencedTop";
    text: string;
    type: string;
}

export interface AreaProps extends TagProps<HTMLAreaElement> {
    alt: string;
    coords: string;
    download: string;
    ping: string;
    referrerPolicy: ReferrerPolicy;
    rel: string;
    shape: string;
    target: string;
}

export interface BaseProps extends TagProps<HTMLBaseElement> {
    href: string;
    target: string;
}

export interface ButtonProps extends TagProps<HTMLButtonElement> {
    disabled: boolean;
    formAction: string;
    formEnctype: string;
    formMethod: string;
    formNoValidate: boolean;
    formTarget: string;
    name: string;
    type: string;
    value: string;
}

export interface CanvasProps extends TagProps<HTMLCanvasElement> {
    height: number;
    width: number;
}

export interface DataProps extends TagProps<HTMLDataElement> {
    value: string;
}

export interface DetailsProps extends TagProps<HTMLDetailsElement> {
    open: boolean;
}

export interface EmbedProps extends TagProps<HTMLEmbedElement> {
    height: string;
    src: string;
    type: string;
    width: string;
}

export interface FieldSetProps extends TagProps<HTMLFieldSetElement> {
    disabled: boolean;
    name: string;
}

export interface FormProps extends TagProps<HTMLFormElement> {
    acceptCharset: string;
    action: string;
    autocomplete: string;
    encoding: string;
    enctype: string;
    method: string;
    name: string;
    noValidate: boolean;
    target: string;
}

export interface IFrameProps extends TagProps<HTMLIFrameElement> {
    allow: string;
    allowFullscreen: boolean;
    height: string;
    name: string;
    referrerPolicy: ReferrerPolicy;
    src: string;
    srcdoc: string;
    width: string;
}

export interface ImageProps extends TagProps<HTMLImageElement> {
    alt: string;
    crossOrigin: string | null;
    decoding: "async" | "sync" | "auto";
    height: number;
    isMap: boolean;
    loading: string;
    referrerPolicy: string;
    sizes: string;
    src: string;
    srcset: string;
    useMap: string;
    width: number;
}

export interface InputProps extends TagProps<HTMLInputElement> {
    accept: string;
    alt: string;
    autocomplete: string;
    capture: string;
    checked: boolean;
    defaultChecked: boolean;
    defaultValue: string;
    dirName: string;
    disabled: boolean;
    files: FileList | null;
    formAction: string;
    formEnctype: string;
    formMethod: string;
    formNoValidate: boolean;
    formTarget: string;
    height: number;
    indeterminate: boolean;
    max: string;
    maxLength: number;
    min: string;
    minLength: number;
    multiple: boolean;
    name: string;
    pattern: string;
    placeholder: string;
    readOnly: boolean;
    required: boolean;
    selectionDirection: "forward" | "backward" | "none" | null;
    selectionEnd: number | null;
    selectionStart: number | null;
    size: number;
    src: string;
    step: string;
    type: string;
    value: string;
    valueAsDate: Date | null;
    valueAsNumber: number;
    webkitdirectory: boolean;
    width: number;
}

export interface LabelProps extends TagProps<HTMLLabelElement> {
    htmlFor: string;
}

export interface LiProps extends TagProps<HTMLLIElement> {
    value: number;
}

export interface LinkProps extends TagProps<HTMLLinkElement> {
    as: string;
    crossOrigin: string | null;
    disabled: boolean;
    href: string;
    hreflang: string;
    imageSizes: string;
    imageSrcset: string;
    integrity: string;
    media: string;
    referrerPolicy: string;
    rel: string;
    type: string;
}

export interface MapProps extends TagProps<HTMLMapElement> {
    name: string;
}

export interface MediaProps<T extends HTMLMediaElement> extends TagProps<T> {
    autoplay?: boolean;
    controls?: boolean;
    crossOrigin?: string | null;
    currentTime?: number;
    defaultMuted?: boolean;
    defaultPlaybackRate?: number;
    disableRemotePlayback?: boolean;
    loop?: boolean;
    muted?: boolean;
    onencrypted?: ((this: T, ev: MediaEncryptedEvent) => any) | null;
    onwaitingforkey?: ((this: T, ev: Event) => any) | null;
    playbackRate?: number;
    preload?: "none" | "metadata" | "auto" | "";
    src?: string;
    srcObject?: MediaProvider | null;
    volume?: number;
}

export interface MeterProps extends TagProps<HTMLMeterElement> {
    high: number;
    low: number;
    max: number;
    min: number;
    optimum: number;
    value: number;
}

export interface ModProps<T extends HTMLModElement> extends TagProps<T> {
    cite: string;
    dateTime: string;
}

export interface ObjectProps extends TagProps<HTMLObjectElement> {
    data: string;
    height: string;
    name: string;
    type: string;
    useMap: string;
    width: string;
}

export interface OListProps extends TagProps<HTMLOListElement> {
    reversed: boolean;
    start: number;
    type: string;
}

export interface OptGroupProps extends TagProps<HTMLOptGroupElement> {
    disabled: boolean;
    label: string;
}

export interface OptionProps extends TagProps<HTMLOptionElement> {
    defaultSelected: boolean;
    disabled: boolean;
    label: string;
    selected: boolean;
    text: string;
    value: string;
}

export interface OutputProps extends TagProps<HTMLOutputElement> {
    defaultValue: string;
    name: string;
    value: string;
}

export interface ProgressProps extends TagProps<HTMLProgressElement> {
    max: number;
    value: number;
}

export interface QuoteProps extends TagProps<HTMLQuoteElement> {
    cite: string;
}

export interface ScriptProps extends TagProps<HTMLScriptElement> {
    async: boolean;
    crossOrigin: string | null;
    defer: boolean;
    integrity: string;
    noModule: boolean;
    referrerPolicy: string;
    src: string;
    text: string;
    type: string;
}

export interface SelectProps extends TagProps<HTMLSelectElement> {
    autocomplete: string;
    disabled: boolean;
    length: number;
    multiple: boolean;
    name: string;
    required: boolean;
    selectedIndex: number;
    size: number;
    value: string;
}

export interface SlotProps extends TagProps<HTMLSlotElement> {
    name: string;
}

export interface SourceProps extends TagProps<HTMLSourceElement> {
    media: string;
    sizes: string;
    src: string;
    srcset: string;
    type: string;
}

export interface StyleProps extends TagProps<HTMLStyleElement> {
    media: string;
}

export interface TableCellProps extends TagProps<HTMLTableCellElement> {
    abbr: string;
    colSpan: number;
    headers: string;
    rowSpan: number;
    scope: string;
}

export interface TableColProps extends TagProps<HTMLTableColElement> {
    span: number;
}

export interface TableProps extends TagProps<HTMLTableElement> {
    caption: HTMLTableCaptionElement | null;
    tFoot: HTMLTableSectionElement | null;
    tHead: HTMLTableSectionElement | null;
}

export interface TagEventsProps<T extends Element> {
    onabort?: ((this: T, ev: UIEvent) => any) | null;
    onanimationcancel?: ((this: T, ev: AnimationEvent) => any) | null;
    onanimationend?: ((this: T, ev: AnimationEvent) => any) | null;
    onanimationiteration?: ((this: T, ev: AnimationEvent) => any) | null;
    onanimationstart?: ((this: T, ev: AnimationEvent) => any) | null;
    onauxclick?: ((this: T, ev: MouseEvent) => any) | null;
    onblur?: ((this: T, ev: FocusEvent) => any) | null;
    oncanplay?: ((this: T, ev: Event) => any) | null;
    oncanplaythrough?: ((this: T, ev: Event) => any) | null;
    onchange?: ((this: T, ev: Event) => any) | null;
    onclick?: ((this: T, ev: MouseEvent) => any) | null;
    onclose?: ((this: T, ev: Event) => any) | null;
    oncontextmenu?: ((this: T, ev: MouseEvent) => any) | null;
    oncopy?: ((this: T, ev: ClipboardEvent) => any) | null;
    oncut?: ((this: T, ev: ClipboardEvent) => any) | null;
    oncuechange?: ((this: T, ev: Event) => any) | null;
    ondblclick?: ((this: T, ev: MouseEvent) => any) | null;
    ondrag?: ((this: T, ev: DragEvent) => any) | null;
    ondragend?: ((this: T, ev: DragEvent) => any) | null;
    ondragenter?: ((this: T, ev: DragEvent) => any) | null;
    ondragleave?: ((this: T, ev: DragEvent) => any) | null;
    ondragover?: ((this: T, ev: DragEvent) => any) | null;
    ondragstart?: ((this: T, ev: DragEvent) => any) | null;
    ondrop?: ((this: T, ev: DragEvent) => any) | null;
    ondurationchange?: ((this: T, ev: Event) => any) | null;
    onemptied?: ((this: T, ev: Event) => any) | null;
    onended?: ((this: T, ev: Event) => any) | null;
    onerror?: ((this: T, ev: Event | string, src?: string, line?: number, col?: number, err?: Error) => any) | null;
    onfocus?: ((this: T, ev: FocusEvent) => any) | null;
    onformdata?: ((this: T, ev: FormDataEvent) => any) | null;
    onfullscreenchange?: ((this: T, ev: Event) => any) | null;
    onfullscreenerror?: ((this: T, ev: Event) => any) | null;
    ongotpointercapture?: ((this: T, ev: PointerEvent) => any) | null;
    oninput?: ((this: T, ev: Event) => any) | null;
    oninvalid?: ((this: T, ev: Event) => any) | null;
    onkeydown?: ((this: T, ev: KeyboardEvent) => any) | null;
    onkeypress?: ((this: T, ev: KeyboardEvent) => any) | null;
    onkeyup?: ((this: T, ev: KeyboardEvent) => any) | null;
    onload?: ((this: T, ev: Event) => any) | null;
    onloadeddata?: ((this: T, ev: Event) => any) | null;
    onloadedmetadata?: ((this: T, ev: Event) => any) | null;
    onloadstart?: ((this: T, ev: Event) => any) | null;
    onlostpointercapture?: ((this: T, ev: PointerEvent) => any) | null;
    onmousedown?: ((this: T, ev: MouseEvent) => any) | null;
    onmouseenter?: ((this: T, ev: MouseEvent) => any) | null;
    onmouseleave?: ((this: T, ev: MouseEvent) => any) | null;
    onmousemove?: ((this: T, ev: MouseEvent) => any) | null;
    onmouseout?: ((this: T, ev: MouseEvent) => any) | null;
    onmouseover?: ((this: T, ev: MouseEvent) => any) | null;
    onmouseup?: ((this: T, ev: MouseEvent) => any) | null;
    onpaste?: ((this: T, ev: ClipboardEvent) => any) | null;
    onpause?: ((this: T, ev: Event) => any) | null;
    onplay?: ((this: T, ev: Event) => any) | null;
    onplaying?: ((this: T, ev: Event) => any) | null;
    onpointercancel?: ((this: T, ev: PointerEvent) => any) | null;
    onpointerdown?: ((this: T, ev: PointerEvent) => any) | null;
    onpointerenter?: ((this: T, ev: PointerEvent) => any) | null;
    onpointerleave?: ((this: T, ev: PointerEvent) => any) | null;
    onpointermove?: ((this: T, ev: PointerEvent) => any) | null;
    onpointerout?: ((this: T, ev: PointerEvent) => any) | null;
    onpointerover?: ((this: T, ev: PointerEvent) => any) | null;
    onpointerup?: ((this: T, ev: PointerEvent) => any) | null;
    onprogress?: ((this: T, ev: ProgressEvent) => any) | null;
    onratechange?: ((this: T, ev: Event) => any) | null;
    onreset?: ((this: T, ev: Event) => any) | null;
    onresize?: ((this: T, ev: UIEvent) => any) | null;
    onscroll?: ((this: T, ev: Event) => any) | null;
    onseeked?: ((this: T, ev: Event) => any) | null;
    onseeking?: ((this: T, ev: Event) => any) | null;
    onselect?: ((this: T, ev: Event) => any) | null;
    onselectionchange?: ((this: T, ev: Event) => any) | null;
    onselectstart?: ((this: T, ev: Event) => any) | null;
    onstalled?: ((this: T, ev: Event) => any) | null;
    onsubmit?: ((this: T, ev: SubmitEvent) => any) | null;
    onsuspend?: ((this: T, ev: Event) => any) | null;
    ontimeupdate?: ((this: T, ev: Event) => any) | null;
    ontoggle?: ((this: T, ev: Event) => any) | null;
    ontouchcancel?: ((this: T, ev: TouchEvent) => any) | null | undefined;
    ontouchend?: ((this: T, ev: TouchEvent) => any) | null | undefined;
    ontouchmove?: ((this: T, ev: TouchEvent) => any) | null | undefined;
    ontouchstart?: ((this: T, ev: TouchEvent) => any) | null | undefined;
    ontransitioncancel?: ((this: T, ev: TransitionEvent) => any) | null;
    ontransitionend?: ((this: T, ev: TransitionEvent) => any) | null;
    ontransitionrun?: ((this: T, ev: TransitionEvent) => any) | null;
    ontransitionstart?: ((this: T, ev: TransitionEvent) => any) | null;
    onvolumechange?: ((this: T, ev: Event) => any) | null;
    onwaiting?: ((this: T, ev: Event) => any) | null;
    onwheel?: ((this: T, ev: WheelEvent) => any) | null;
}

export interface TagProps<T extends Element> extends TagEventsProps<T> {
    autofocus?: boolean;
    className?: string;
    nonce?: string | undefined;
    tabIndex?: number;
    accessKey?: string;
    autocapitalize?: string;
    dir?: string;
    draggable?: boolean;
    hidden?: boolean;
    innerText?: string;
    lang?: string;
    outerText?: string;
    spellcheck?: boolean;
    title?: string;
    translate?: boolean;
}

export interface TextAreaProps extends TagProps<HTMLTextAreaElement> {
    autocomplete: string;
    cols: number;
    defaultValue: string;
    dirName: string;
    disabled: boolean;
    maxLength: number;
    minLength: number;
    name: string;
    placeholder: string;
    readOnly: boolean;
    required: boolean;
    rows: number;
    selectionDirection: "forward" | "backward" | "none";
    selectionEnd: number;
    selectionStart: number;
    value: string;
    wrap: string;
}

export interface TimeProps extends TagProps<HTMLTimeElement> {
    dateTime: string;
}

export interface TitleProps extends TagProps<HTMLTitleElement> {
    text: string;
}

export interface TrackProps extends TagProps<HTMLTrackElement> {
    default: boolean;
    kind: string;
    label: string;
    src: string;
    srclang: string;
}

export interface VideoProps extends MediaProps<HTMLVideoElement> {
    disablePictureInPicture?: boolean;
    height?: number;
    onenterpictureinpicture?: ((this: HTMLVideoElement, ev: Event) => any) | null;
    onleavepictureinpicture?: ((this: HTMLVideoElement, ev: Event) => any) | null;
    playsInline?: boolean;
    poster?: string;
    width?: number;
}

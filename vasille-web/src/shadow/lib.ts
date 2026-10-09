import { App, Fragment, Reference } from "vasille";
import { ref } from "vasille-jsx";
import { Runner, Tag, TagOptions } from "vasille/web-runner";
import { ShadowCssStyleInjector, StyleSheetsManager } from "./css.js";

const any = 0;
const string = 1;
const number = 2;
const boolean = 3;

interface PropsDeclaration {
    [key: string]: typeof string | typeof number | typeof boolean | typeof any;
}

class ShadowTag extends Tag<TagOptions, ShadowRunner> {
    public applyOptions(options: TagOptions) {
        if (options.c) {
            for (const className of options.c) {
                if (className instanceof ShadowCssStyleInjector) {
                    className.link(this.runner.styles);
                }
            }
        }
        super.applyOptions(options);
    }
}

class ShadowFragment extends Fragment<Node, Element, TagOptions, ShadowRunner> {
    public constructor(app: App<Node, Element, TagOptions, ShadowRunner>) {
        super(app.runner, app.sDeep + 1);
        this.parent = app;
    }
}

class ShadowRunner extends Runner<TagOptions> {
    public readonly styles: StyleSheetsManager;

    public constructor(document: Document, styles: StyleSheetsManager) {
        super(document);
        this.styles = styles;
    }

    tag(
        deep: number,
        tagName: string,
        input: TagOptions,
        cb?: ((ctx: Tag<TagOptions, ShadowRunner>) => void) | undefined,
    ): Tag<TagOptions, ShadowRunner> {
        if (cb) {
            input.l = cb;
        }
        return new ShadowTag(input, this, tagName, deep);
    }
}

function toKebabCase(propName: string) {
    let index = propName.startsWith("$") ? 1 : 0;
    let name = propName[index].toLowerCase();

    for (index++; index < propName.length; index++) {
        const curr = propName[index];

        if (curr === curr.toUpperCase()) {
            name += "-";
        }

        name += curr.toLowerCase();
    }

    return name;
}

function readRef(ref: unknown) {
    if (ref instanceof Reference) {
        return ref.V;
    }

    return ref;
}

function matchAndSet(o: object, key: string, value: unknown) {
    if (key.startsWith("$")) {
        if (value instanceof Reference) {
            o[key] = value;
        } else {
            o[key].V = value;
        }
    } else {
        o[key] = readRef(value);
    }
}

export function shadow(
    renderer: (node: Fragment<Node, Element, TagOptions>, input: object) => unknown,
    name: string,
    props: PropsDeclaration,
): void {
    const observableAttributes: string[] = [];
    const attributesNamesMap = new Map<string, string>();
    const styleManager = new StyleSheetsManager();

    for (const key in props) {
        if (props[key]) {
            const attributeName = toKebabCase(key);
            observableAttributes.push(attributeName);
            attributesNamesMap.set(attributeName, key);
        }
    }

    customElements.define(
        name,
        class extends HTMLElement {
            static observedAttributes = observableAttributes;

            protected props: { [k: string]: unknown };
            protected events: { [k: string]: unknown };
            protected root: App<Node, Element, TagOptions, ShadowRunner>;

            public constructor() {
                super();

                const entityProps = (this.props = {});
                const entityEvents = (this.events = {});

                for (const key in props) {
                    const isEvent = key.startsWith("on");
                    const isReactive = key.startsWith("$");
                    const container = isEvent ? entityEvents : entityProps;

                    Object.defineProperty(this, isReactive ? key.slice(1) : key, {
                        get: () => readRef(container[key]),
                        set: (value: unknown) => matchAndSet(container, key, value),
                    });

                    if (isReactive) {
                        entityProps[key] = ref(void 0);
                    }
                    if (isEvent) {
                        const kebab = toKebabCase(key);
                        const eventName = kebab[2] === "-" ? kebab.slice(3) : kebab.slice(2);

                        entityProps[key] = (...args: unknown[]) => {
                            this.dispatchEvent(new CustomEvent(eventName, { detail: args[0] }));
                            return entityEvents[key]?.(...args);
                        };
                    }
                }

                const shadowRoot = this.attachShadow({ mode: "open" });

                styleManager.addRoot(shadowRoot);
                this.root = new App<Node, Element, TagOptions, ShadowRunner>(
                    shadowRoot as unknown as Element,
                    new ShadowRunner(document, styleManager),
                );
            }

            public connectedCallback() {
                const result = renderer(new ShadowFragment(this.root), this.props);

                /* istanbul ignore else */
                if (result && typeof result === "object" && result.constructor === Object) {
                    // Object.assign does not copy getters and setters
                    Object.defineProperties(this, Object.getOwnPropertyDescriptors(result));
                }
            }

            public disconnectedCallback() {
                this.root.destroy(this.root.sDeep);
            }

            public attributeChangedCallback(name: string, oldValue: string, newValue: string | null) {
                const propName = attributesNamesMap.get(name);
                /* istanbul ignore else */
                if (propName) {
                    const type = props[propName];

                    switch (type) {
                        case string: {
                            matchAndSet(this.props, propName, newValue);
                            break;
                        }
                        case number: {
                            matchAndSet(this.props, propName, newValue ? parseFloat(newValue) : 0);
                            break;
                        }
                        case boolean: {
                            matchAndSet(this.props, propName, newValue !== null);
                            break;
                        }
                    }
                }
            }
        },
    );
}

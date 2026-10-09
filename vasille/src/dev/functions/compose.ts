import { AppNode, Fragment, Reactive, IRunner } from "../../classes/index.js";
import { CompositionProps } from "../../functions/index.js";
import {
    DevAppNode,
    DevFragment,
    errorToString,
    Inspector,
    inspector,
    ModelId,
    StaticPosition,
    toDevIdOrValue,
} from "../classes/index.js";

export type DevComposed<Node, Element, TagOptions extends object, In extends CompositionProps, Out> = (
    $: In & { callback?(data: Out | undefined): void },
    node?: Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
    slot?: In["slot"],
    usage?: StaticPosition,
) => void;

export type DevInput<In, Out> = In & { callback?(data: Out | undefined): void };

export type DevFragmentMap<Node, Element, TagOptions extends object, In> = Map<
    Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
    {
        props: In;
        node: Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>;
        usage: StaticPosition | undefined;
    }
>;

export function devDynamicalModule<T, Node, Element, TagOptions extends object, Props>(
    composed: T,
    fragments: DevFragmentMap<Node, Element, TagOptions, Props>,
    safeRun: (
        parent: Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        props: Props,
        usage: StaticPosition | undefined,
    ) => void,
): T {
    Object.defineProperties(composed, {
        fragments: {
            value: fragments,
        },
        recompose: {
            value: function (previous: DevFragmentMap<Node, Element, TagOptions, Props>) {
                // inspector erase declaration
                previous.forEach(({ props, node, usage }, key) => {
                    node.children.forEach(child => child.destroy(child.sDeep));
                    node.children.splice(0);
                    safeRun(node, props, usage);
                    fragments.set(key, { props, node, usage });
                });
            },
        },
    });

    return composed;
}

export function devView<Node, Element, TagOptions extends object, In extends CompositionProps, Out>(
    renderer: (node: Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>, input: In) => Out,
    declaration: StaticPosition,
    name: string,
): DevComposed<Node, Element, TagOptions, In, Out> {
    const fragments: DevFragmentMap<Node, Element, TagOptions, DevInput<In, Out>> = new Map();
    const safeRun = function (
        parent: Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>,
        props: DevInput<In, Out>,
        usage: StaticPosition | undefined,
    ) {
        const { callback } = props;
        const frag = new DevFragment<Node, Element, TagOptions>(parent.runner, declaration, usage ?? null, name, props);

        parent.child(frag);

        try {
            const result = renderer(frag, props);

            if (result !== undefined && result !== null && callback) {
                callback(result);
            }
        } catch (e) {
            inspector.reportComponentError({
                id: frag.id,
                error: errorToString(e),
                time: Date.now(),
            });
            reportError(e);
        } finally {
            inspector.composeTime({
                id: frag.id,
                time: Date.now(),
            });
        }
    };
    const composed: DevComposed<Node, Element, TagOptions, In, Out> = function (props, node, slot, usage) {
        if (!node) {
            throw new Error("Vasille: Component context is missing");
        }
        const frag = new Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>(
            node.runner,
            node.sDeep + 1,
        );

        if (slot) {
            props.slot = slot;
        }

        node.child(frag);
        fragments.set(frag, { props, node: frag, usage });
        frag.runOnDestroy(() => fragments.delete(frag));
        safeRun(frag, props, usage);
    };

    return devDynamicalModule(composed, fragments, safeRun);
}

export function devStore<Out extends object>(
    fn: (ctx: Reactive) => Out,
    declaration: StaticPosition,
    name: string,
): Out {
    const reactive = new Reactive(0);

    inspector.createStore({ id: reactive.id!, declaration, name, time: Date.now() });

    return fn(reactive);
}

export class DevModel<In extends object, Out extends object> {
    public constructor(
        private readonly fn: (ctx: Reactive, o: In) => Out,
        public readonly declaration: StaticPosition,
        public readonly name: string,
    ) {}

    create(o: In, parent: Reactive | undefined, usage: StaticPosition): Out {
        const ctx = new Reactive(parent?.sDeep ?? 0);
        const id = ctx.id!;
        const { fn, name, declaration } = this;

        inspector.createCustomModel({
            id,
            declaration,
            usage,
            name,
            time: Date.now(),
        });
        Object.entries(o).forEach(([key, value]) => {
            inspector.customModelProperty({ id, key, value: toDevIdOrValue(value) });
        });
        if (parent) {
            parent.bind(ctx);
        }

        return {
            ...fn(ctx, o),
            [ModelId]: id,
        };
    }
}

export function devModel<In extends object, Out extends object>(
    fn: (ctx: Reactive, o: In) => Out,
    declaration: StaticPosition,
    name: string,
): DevModel<In, Out> {
    return new DevModel<In, Out>(fn, declaration, name);
}

export function createDevModel<In extends object, Out extends object>(
    parent: Reactive | undefined,
    model: DevModel<In, Out>,
    o: In,
    usage: StaticPosition,
): Out {
    return model.create(o, parent, usage);
}

export function devMount<T, Node, Element, TagOptions extends object>(
    tag: Element,
    view: ($: T, node: Fragment<Node, Element, TagOptions, IRunner<Node, Element, TagOptions>>) => unknown,
    runner: IRunner<Node, Element, TagOptions>,
    $: T,
    devInspector: Inspector,
): AppNode<Node, Element, TagOptions> {
    const root = new DevAppNode<Node, Element, TagOptions>(tag, runner);
    const frag = new DevFragment<Node, Element, TagOptions>(runner, null, null, "Root", {});

    // share information about created stores
    inspector.connect(devInspector);

    root.child(frag, function () {
        view($, frag);
    });

    return root;
}

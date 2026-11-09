import { Runner, TagOptions } from "../runner.js";
import { page } from "./page.js";
import {
    AppNode,
    ArrayModel,
    ArrayModelViewNode,
    Expression,
    Fragment,
    IValue,
    Listener,
    MapModel,
    MapViewNode,
    PortalNode,
    Reactive,
    Reference,
    SetModel,
    SetViewNode,
    userError,
    WatchNode,
} from "../../../src/vasille/index.js";

it("import test", function () {
    const window = page();
    const runner = new Runner(window.document);
    const root = new AppNode<Node, Element, TagOptions>(window.document.body, runner);
    const ref = new Reference(1);
    const array = new ArrayModel();
    const map = new MapModel();
    const set = new SetModel();
    const listener = new Listener();
    const arrayView = new ArrayModelViewNode(
        root,
        { of: array, slot: () => void 0, writable: false },
        v => new Reference(v),
        runner => new Fragment(runner),
    );
    const mapView = new MapViewNode(
        root,
        { of: map, slot: () => {}, writable: false },
        v => new Reference(v),
        runner => new Fragment(runner),
    );
    const setView = new SetViewNode(root, { of: set, slot: () => {} }, runner => new Fragment(root));
    const fragment = new Fragment(root);
    const app = new AppNode<Node, Element, TagOptions>(window.document.body, runner);
    const expr = new Expression<number, [number], unknown>(
        v => v,
        v => new Reference(v[0]),
        [ref],
        app,
    );
    const portal = new PortalNode<Node, Element, TagOptions>(root, window.document.body);
    const watch = new WatchNode(root, ref);

    expect(ref instanceof IValue).toBe(true);
    expect(array instanceof Array).toBe(false);
    expect(map instanceof Map).toBe(false);
    expect(set instanceof Set).toBe(false);
    expect(arrayView instanceof Fragment).toBe(true);
    expect(mapView instanceof Fragment).toBe(true);
    expect(setView instanceof Fragment).toBe(true);
    expect(fragment instanceof Reactive).toBe(true);
    expect(app instanceof Reactive).toBe(true);
    expect(expr instanceof IValue).toBe(true);
    expect(portal instanceof Fragment).toBe(true);
    expect(watch instanceof Fragment).toBe(true);
    expect(userError("msg", "e")).toBe("e");
});

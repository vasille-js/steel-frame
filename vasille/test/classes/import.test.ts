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
} from "../../src/classes/index.js";
import { Runner, TagOptions } from "../runner.js";
import { page } from "./page.js";

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
        runner,
        0,
        array,
        () => void 0,
        v => new Reference(v),
        runner => new Fragment(runner, 1),
    );
    const mapView = new MapViewNode(
        runner,
        0,
        map,
        () => {},
        v => new Reference(v),
        runner => new Fragment(runner, 1),
    );
    const setView = new SetViewNode(
        runner,
        0,
        set,
        () => {},
        runner => new Fragment(runner, 1),
    );
    const fragment = new Fragment(runner, 1);
    const app = new AppNode<Node, Element, TagOptions>(window.document.body, runner);
    const expr = new Expression<number, [number], unknown>(
        v => v,
        v => new Reference(v[0]),
        [ref],
        app,
    );
    const portal = new PortalNode<Node, Element, TagOptions>(window.document.body, runner, 1);
    const watch = new WatchNode({ model: ref }, runner, 1);

    expect(ref instanceof IValue).toBe(true);
    expect(array instanceof Array).toBe(true);
    expect(map instanceof Map).toBe(true);
    expect(set instanceof Set).toBe(true);
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

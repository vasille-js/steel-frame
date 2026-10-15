import { devScreen } from "./router.js";
import { devModal, devPrompt, webDevMountApp, webDevRouterApp } from "./mount.js";
import { DevWebTagOptions } from "./runner.js";
import { Inspector } from "./inspector.js";
import { WebRouterInitialization } from "../web/router/router.js";
import {
    devArrayModel,
    DevArrayModelView,
    DevArrayView,
    devAwaited,
    devDebounceRef,
    DevDelay,
    devEnsure,
    devExpr,
    DevFor,
    devMapModel,
    DevMapModelView,
    devMatch,
    devModel,
    devRef,
    devSafeExpr,
    devSafeRef,
    devSet,
    devSetModel,
    DevSetModelView,
    DevSlot,
    devStore,
    DevSwitch,
    devView,
    DevWatch,
    DevZombie,
    toDevDeepFieldRef,
    toDevFieldRef,
    DevAppNode,
} from "vasille/dev";

export { Prompt, showPrompt } from "../web/index.js";
export { executionPosition, wrapFn, runFn, setupPosition } from "vasille/dev";
export { devSetErrorHandler as setErrorHandler } from "vasille/dev";
export { QueuedRender, Model, SteelContext } from "vasille";

export { devStyleSheet as styleSheet } from "./css-injector.js";
export { positionedText } from "./runner.js";

export { safe, abortSignal, safeInit } from "vasille";
export {
    devSetLaptopMaxWidth as setLaptopMaxWidth,
    devSetTabletMaxWidth as setTabletMaxWidth,
    devSetMobileMaxWidth as setMobileMaxWidth,
} from "./css.js";
export { context, impute, receive, share, receiveOptional } from "vasille";

export const view = devView;
export const component = devView;
export const compose = devView;
export const ensure = devEnsure;
export const ref = devRef;
export const expr = devExpr;
export const bind = devExpr;
export const calculate = devExpr;
export const watch = devExpr;
export const effect = devExpr;
export const safeLive = devSafeExpr;
export const safeState = devSafeRef;
export const set = devSet;
export const Delay = DevDelay;
export const For = DevFor;
export const Slot = DevSlot;
export const Watch = DevWatch;
export const awaited = devAwaited;
export const store = devStore;
export const model = devModel;
export const setModel = devSetModel;
export const mapModel = devMapModel;
export const arrayModel = devArrayModel;
export const Switch = DevSwitch;
export const match = devMatch;
export const ArrayView = DevArrayView;
export const MapModelView = DevMapModelView;
export const SetModelView = DevSetModelView;
export const ArrayModelView = DevArrayModelView;
export const Zombie = DevZombie;
export const debounced = devDebounceRef;
export const toFieldRef = toDevFieldRef;
export const toDeepFieldRef = toDevDeepFieldRef;

export const screen = devScreen;
export const page = devScreen;

export const modal = devModal;
export const prompt = devPrompt;

export function mount<T>(
    element: Element,
    component: ($: T) => void,
    input: T,
): DevAppNode<Node, Element, DevWebTagOptions> {
    const inspector = new Inspector();
    const app = webDevMountApp<T>(element, component, input, inspector);
    inspector.setup(app);
    return app;
}

export function routerApp<Routes extends string>(
    init: WebRouterInitialization<Routes>,
    element?: Element,
): DevAppNode<Node, Element, DevWebTagOptions> {
    const inspector = new Inspector();
    const app = webDevRouterApp(init, element ?? document.body, inspector);
    inspector.setup(app);
    return app;
}

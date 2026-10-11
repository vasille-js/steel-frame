import {
    devArrayModel,
    devAwaited,
    DevDelay,
    devEnsure,
    devExpr,
    DevFor,
    devMapModel,
    devMatch,
    devModel,
    devRef,
    devSet,
    devSetModel,
    DevSlot,
    devStore,
    DevSwitch,
    devView,
    DevWatch,
    DevArrayView,
    DevMapModelView,
    DevSetModelView,
    DevArrayModelView,
    DevZombie,
    devDebounceRef,
    toDevFieldRef,
    toDevDeepFieldRef,
    devSafeRef,
    devSafeExpr,
    DevAppNode,
} from "vasille/dev";
import { WebRouterInitialization } from "vasille-web";
import { devModal, devPrompt, DevWebTagOptions, webDevMountApp, webDevRouterApp } from "vasille-web/dev";
import { devScreen } from "vasille-web/dev";
import { Inspector } from "./inspector.js";

export { executionPosition, wrapFn, runFn, setupPosition } from "vasille/dev";
export { devSetErrorHandler } from "vasille/dev";
export { QueuedRender } from "vasille";
export { type IdeSide, type AppSide } from "./communication.js";

export { devStyleSheet as styleSheet, positionedText } from "vasille-web/dev";
export {
    type QueryParams,
    type ScreenProps,
    type RouteParameters,
    type FallbackScreenProps,
    type ErrorScreenProps,
    type WebRouterInitialization,
    type NavigationMode,
    type WebRouter,
    safe,
    abortSignal,
    safeInit,
} from "vasille-web";
export {
    devSetLaptopMaxWidth as setLaptopMaxWidth,
    devSetTabletMaxWidth as setTabletMaxWidth,
    devSetMobileMaxWidth as setMobileMaxWidth,
} from "vasille-web/dev";
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
export const debounceRef = devDebounceRef;
export const toFieldRef = toDevFieldRef;
export const toDeepFieldRef = toDevDeepFieldRef;
export const safeRef = devSafeRef;
export const safeExpr = devSafeExpr;

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

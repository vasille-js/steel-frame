import { setErrorHandler } from "../../classes/index.js";
import { errorToString, inspector } from "../classes/index.js";

export {
    DevDelay,
    DevWatch,
    DevFor,
    DevSwitch,
    DevSlot,
    DevSetModelView,
    DevMapModelView,
    DevArrayModelView,
    DevArrayView,
    DevZombie,
} from "./components.js";
export {
    devStore,
    type DevComposed,
    devModel,
    devMount,
    devView,
    devDynamicalModule,
    createDevModel,
    DevModel,
    type DevFragmentMap,
} from "./compose.js";
export {
    devArrayModel,
    devMapModel,
    devEnsure,
    devExpr,
    devMatch,
    devSetModel,
    devRef,
    devSet,
    devSafeRef,
    devSafeExpr,
    toDevDeepFieldRef,
    toDevFieldRef,
    devDebounceRef,
} from "./internal.js";
export { devAwaited } from "./library.js";

function devErrorHandler(e: unknown) {
    inspector.reportError({
        id: 0,
        error: errorToString(e),
        time: Date.now(),
    });
    console.error(e);
}

setErrorHandler(devErrorHandler);

export function devSetErrorHandler(fn: (e: unknown) => void) {
    setErrorHandler(e => {
        devErrorHandler(e);
        fn(e);
    });
}

import { component, debounced, state } from "steel-frame";

const C = component(() => {
    let wr$1 = state(1);
    let wr$2 = debounced(wr$1, 1);
});

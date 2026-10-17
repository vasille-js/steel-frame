import { component, debounced, state } from "steel-frame";

const C = component(() => {
    let wr_1 = state(1);
    const wr_2 = debounced(wr_1, 1);
});

import { component, live, state } from "steel-frame";

const C = component(() => {
    let wr$1 = state(1);
    const wr$2 = live(wr$1 + 1);
});

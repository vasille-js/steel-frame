import { component, field, state } from "steel-frame";

const C = component(() => {
    let wr_1 = state({ a: 1 });
    let r_2 = field(wr_1.a);
});

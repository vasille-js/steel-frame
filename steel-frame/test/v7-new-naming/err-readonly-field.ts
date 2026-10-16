import { component, field, state } from "steel-frame";

const C = component(() => {
    let wr$1 = state({ a: 1 });
    let r$2 = field(wr$1.a);
});

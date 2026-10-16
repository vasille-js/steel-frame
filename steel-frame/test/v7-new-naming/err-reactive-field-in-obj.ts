import { component } from "steel-frame";

const C = component(() => {
    let wr$ = 1;
    const r$ = wr$ + 1;
    const obj = {
        // allowed
        r$: r$,
        // throw error
        wr$: wr$,
    };
});

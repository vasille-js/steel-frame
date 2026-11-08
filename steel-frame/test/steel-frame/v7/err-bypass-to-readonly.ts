import { compose, effect, bypassWriteRestriction } from "steel-frame";

const C = compose(() => {
    let wr_a = 1;
    const r_b = wr_a + 2;

    effect(() => {
        bypassWriteRestriction(r_b, wr_a);
    });
});

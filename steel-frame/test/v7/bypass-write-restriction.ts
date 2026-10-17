import { compose, effect, bypassWriteRestriction } from "steel-frame";

const C = compose(() => {
    let wr_a = 1;
    let wr_b = 2;

    effect(() => {
        bypassWriteRestriction(wr_a, wr_b);
    });
});

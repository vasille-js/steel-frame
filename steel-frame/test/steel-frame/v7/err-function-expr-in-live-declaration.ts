import { compose, live } from "steel-frame";

const C = compose(() => {
    let wr_a = 1;
    let r_b = live(function foo() {
        return 1 + wr_a;
    });
});

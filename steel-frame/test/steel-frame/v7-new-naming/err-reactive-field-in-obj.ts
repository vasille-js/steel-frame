import { component } from "steel-frame";

const C = component(() => {
    let wr_ = 1;
    const r_ = wr_ + 1;
    const obj = {
        // allowed
        r_: r_,
        // throw error
        wr_: wr_,
    };
});

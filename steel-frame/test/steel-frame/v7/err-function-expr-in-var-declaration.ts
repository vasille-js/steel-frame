import { compose } from "steel-frame";

const C = compose(() => {
    let wr_1 = 1;
    let a = function foo() {
        return wr_1;
    };
});

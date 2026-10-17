import { bind, compose } from "steel-frame";

const C = compose(() => {
    let $a = bind(foo());

    function foo() {
        return 1;
    }
});

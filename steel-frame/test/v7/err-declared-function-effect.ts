import { compose, effect } from "steel-frame";

const C = compose(() => {
    let $a = 0;

    effect(() => {
        console.log($a);
        foo();
    });

    function foo() {
        console.log("effect");
    }
});

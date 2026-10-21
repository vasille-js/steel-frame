import { compose, ref } from "steel-frame";

const C = compose(() => {
    let $a = ref(0);
    let b = foo;

    function foo() {
        return $a + 1;
    }

    return { $a, b };
});

import { calculate, compose, ref, watch } from "steel-frame";

const obj = {
    $nested: ref({
        level2: 2,
    }),
};
let edit = { b: 1 };

const C = compose(() => {
    let $a = 2;
    const $nested = obj.$nested;
    const $sum = calculate(() => {
        return $a + $nested.level2;
    });

    watch(function update() {
        let rest;
        edit.b = 2;
        [$a, $nested.level2, ...rest] = [$nested.level2, $a];
    });
});

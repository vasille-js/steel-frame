import { ref } from "steel-frame";

let $a: any = ref({
    [Symbol.iterator]: () => [],
    $b: ref(1),
});

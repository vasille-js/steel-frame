import { awaited, beforeMount, compose } from "steel-frame";

const C = compose(() => {
    // @ts-expect-error
    const [$err, $data] = awaited(new Promise(rv => rv(2)));

    beforeMount(() => console.log($err, $data));
});

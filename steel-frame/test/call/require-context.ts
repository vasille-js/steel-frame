import * as DX from "steel-frame";

const promise0 = () =>
    new Promise(rv => {
        rv(0);
    });

const C = DX.compose(() => {
    const [$err, $result, retry] = DX.awaited(() => promise0());

    DX.beforeMount(() => console.log($err, $result, retry));
});

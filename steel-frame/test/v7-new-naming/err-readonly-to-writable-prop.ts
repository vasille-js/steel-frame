import { beforeMount, component } from "steel-frame";

function fn(props: { wr$: number }) {}

const C = component(() => {
    let wr$ = 1;
    const r$ = wr$ + 1;

    beforeMount(() => {
        fn({ wr$: r$ });
    });
});

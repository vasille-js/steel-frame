import { beforeMount, compose } from "steel-frame";

const C = compose((props: { r$: number }) => {
    beforeMount(() => {
        props.r$ = 1;
    });
});

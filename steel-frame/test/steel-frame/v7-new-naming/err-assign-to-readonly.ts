import { beforeMount, compose } from "steel-frame";

const C = compose((props: { r_: number }) => {
    beforeMount(() => {
        props.r_ = 1;
    });
});

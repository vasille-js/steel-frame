import { beforeMount, component } from "steel-frame";

function fn(props: { wr_: number }) {}

const C = component(() => {
    let wr_ = 1;
    const r_ = wr_ + 1;

    beforeMount(() => {
        fn({ wr_: r_ });
    });
});

import { beforeMount, component } from "steel-frame";

const B = component((props: { wr_: number }) => {});

const C = component(() => {
    let wr_ = 1;
    const r_ = wr_ + 1;

    <B wr_={r_} />;
});

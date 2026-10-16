import { beforeMount, component } from "steel-frame";

const B = component((props: { wr$: number }) => {});

const C = component(() => {
    let wr$ = 1;
    const r$ = wr$ + 1;

    <B wr$={r$} />;
});

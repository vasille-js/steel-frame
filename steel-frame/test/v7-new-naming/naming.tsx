import { compose, debounced, field, live, ref } from "steel-frame";

interface Props {
    wr$1: number;
    r$2: number;
    r$3: number;
}

const C = compose<Props>(() => {
    let wr$1 = 1;
    let wr$2 = ref(2);
    const wr$3 = ref(3);
    const r$4 = wr$3 + 1;
    const r$5 = live(r$4 + 1);
    let wr$obj = { a: { b: 1 } };
    let wr$6 = wr$obj.a;
    let wr$7 = field(wr$obj.a);
    const wr$8 = field(wr$obj.a.b);
    const r$9 = debounced(wr$8, 100);
});

const D = compose(() => {
    let wr$ = 1;
    const r$ = wr$ + 1;

    <C wr$1={wr$} r$2={wr$} r$3={r$} />;
});

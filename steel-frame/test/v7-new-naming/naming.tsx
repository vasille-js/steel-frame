import { compose, debounced, field, live, ref } from "steel-frame";

interface Props {
    wr_1: number;
    r_2: number;
    r_3: number;
}

const C = compose<Props>(() => {
    let wr_1 = 1;
    let wr_2 = ref(2);
    const wr_3 = ref(3);
    const r_4 = wr_3 + 1;
    const r_5 = live(r_4 + 1);
    let wr_obj = { a: { b: 1 } };
    let wr_6 = wr_obj.a;
    let wr_7 = field(wr_obj.a);
    const wr_8 = field(wr_obj.a.b);
    const r_9 = debounced(wr_8, 100);
});

const D = compose(() => {
    let wr_ = 1;
    const r_ = wr_ + 1;

    <C wr_1={wr_} r_2={wr_} r_3={r_} />;
});

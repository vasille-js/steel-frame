import { compose, field } from "steel-frame";

interface Props {
    r_a: number;
}

const A = compose<Props>(() => {});

const C = compose(() => {
    let wr_obj = { a: 1, b: { a: 1 } };

    <A r_a={field(wr_obj.b.a)}></A>;
});

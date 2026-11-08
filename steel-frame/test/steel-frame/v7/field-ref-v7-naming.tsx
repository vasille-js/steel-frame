import { bind, compose, field } from "steel-frame";

interface Props {
    wr_a: number;
    r_a: number;
}

const A = compose<Props>(() => {});

const C = compose(() => {
    let wr_obj = { a: 1, b: { a: 1 } };
    let wr_ref1 = wr_obj.a;
    let wr_ref2 = wr_obj.b.a;
    let wr_ref3 = field(wr_obj.a);
    let wr_ref4 = field(wr_obj?.b.a);

    const a = "a";
    let wr_ref5 = wr_obj[a];
    let wr_ref6 = wr_obj.b[a];
    let wr_ref7 = field(wr_obj[a]);
    let wr_ref8 = field(wr_obj.b[a]);

    <A r_a={wr_obj.a} wr_a={wr_obj.a}></A>;
    <A r_a={wr_obj.b.a} wr_a={wr_obj.b.a}></A>;
    <A r_a={bind(wr_obj.a)} wr_a={field(wr_obj.a)}></A>;
    <A r_a={bind(wr_obj.b.a)} wr_a={field(wr_obj.b.a)}></A>;
});

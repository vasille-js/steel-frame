import { compose, ArrayView } from "steel-frame";

const C = compose(() => {
    let wr_arr = [1, 2];

    <ArrayView
        r_of={wr_arr}
        key={i => i}
        slot={wr_item => {
            <div>{wr_item}</div>;
        }}
    />;
});

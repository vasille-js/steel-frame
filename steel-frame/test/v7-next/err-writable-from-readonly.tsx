import { compose, ArrayView } from "steel-frame";

const C = compose(() => {
    let wr_arr = [1, 2];
    const r_arr = [...wr_arr, 3];

    <ArrayView
        r_of={r_arr}
        key={i => i}
        slot={function (wr_item) {
            <div>{wr_item}</div>;
        }}
    />;
});

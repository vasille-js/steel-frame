import { compose, arrayModel, ArrayModelView } from "steel-frame";

const C = compose(() => {
    const model = arrayModel([1, 2]);

    <ArrayModelView
        of={model}
        slot={r_item => {
            <div>{r_item}</div>;
        }}
    />;
});

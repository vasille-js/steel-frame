import { compose, mapModel, MapModelView } from "steel-frame";

const C = compose(() => {
    const model = mapModel([[1, "s"]]);

    <MapModelView
        of={model}
        slot={wr_item => {
            <div>{wr_item}</div>;
        }}
    />;
});

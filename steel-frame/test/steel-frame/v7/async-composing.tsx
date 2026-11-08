import { awaited, compose } from "steel-frame";

function promise() {
    return new Promise(resolve => resolve(1));
}

const C = compose(() => {
    const [$err, $data] = awaited(() => promise());

    <C />;
});

import { compose } from "steel-frame";

const c = () => 3;

const C = compose(() => {
    const compose = c;
    const sum = compose() + 2;
});

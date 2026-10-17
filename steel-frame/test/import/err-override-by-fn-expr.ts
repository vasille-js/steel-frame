import { compose } from "steel-frame";

const C = compose(() => {
    const recusive = compose;
    const sum = recusive(2);

    function compose(x: number): number {
        return x <= 0 ? 1 : compose(x - 1) + x;
    }
});

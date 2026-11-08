import { awaited, compose } from "steel-frame";

function promise(num: number) {
    return new Promise(resolve => resolve(num));
}

const C = compose(() => {
    let wr_a = 1;
    const [r_err, r_data] = awaited(async signal => {
        const r = await fetch(`/${wr_a}`, { signal });
        return await r.json();
    });
});

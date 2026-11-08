import { compose, Iterate } from "steel-frame";

const C = compose(() => {
    let $arr: number[] = [];

    <Iterate value={$arr} slot={() => {}} />;
});

import { awaited, If, page } from "steel-frame";

export default page(async () => {
    const [$err, $data] = awaited(() => new Promise<number>(resolve => resolve(1)));

    <If $condition={$data}>
        <div>{$data}</div>
    </If>;
    <div>{$data}</div>;
});

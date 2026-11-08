import { awaited, If, page } from "steel-frame";

export default page(async () => {
    const [$err, $data] = awaited(() => new Promise<number>(resolve => resolve(1)));

    <div>
        <div>
            <If $condition={$data}>
                <div>{$data}</div>
            </If>
        </div>
        <div>{$data}</div>
    </div>;
});

import { awaited, beforeMount, If, page } from "steel-frame";

export default page(async () => {
    const [$err, $data, reload] = awaited<number>(() => {
        throw "sync";
    });

    beforeMount(() => {
        reload();
    });

    <If r_condition={$err as any}>{$err as any}</If>;
    <>{$data}</>;
});

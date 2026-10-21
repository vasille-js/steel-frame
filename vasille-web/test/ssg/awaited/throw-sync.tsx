import { awaited, beforeMount, If, page } from "steel-frame";

export default page(async () => {
    const [$err, $data] = awaited<number>(() => {
        throw "sync";
    });

    <If r_condition={$err as any}>{$err as any}</If>;
    <>{$data}</>;
});

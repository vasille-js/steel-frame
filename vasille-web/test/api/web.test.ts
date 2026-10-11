import { checkImports } from "./import-list.ts";

it("checks web exports", function () {
    checkImports("web");
});

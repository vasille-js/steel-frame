import { checkImports } from "./import-list.ts";

it("checks dev exports", function () {
    checkImports("dev", true);
});

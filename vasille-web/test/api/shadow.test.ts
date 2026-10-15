import { checkImports } from "./import-list.ts";

it("checks shadow exports", function () {
    checkImports("shadow");
});

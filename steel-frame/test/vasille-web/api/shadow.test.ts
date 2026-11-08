import { checkImports } from "./import-list.js";

it("checks shadow exports", function () {
    checkImports("shadow");
});

import { checkImports } from "./import-list.js";

it("checks dev exports", function () {
    checkImports("dev", true);
});

import { checkImports } from "./import-list.js";

it("checks web exports", function () {
    checkImports("web");
});

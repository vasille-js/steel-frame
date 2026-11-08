import { checkImports } from "./import-list.js";

it("checks SSG exports", function () {
    checkImports("ssg");
});

import { checkImports } from "./import-list.ts";

it("checks SSG exports", function () {
    checkImports("ssg");
});

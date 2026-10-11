import { runJsxTest } from "../run-test.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("SSG test", function () {
    runJsxTest(__dirname, "ssg", {
        replaceWeb: "vasille-ssg",
        headTag: true,
        bodyTag: true,
    });
});

it("SSG no extra tags test", function () {
    runJsxTest(__dirname, "ssg-no-extra-tags", {
        replaceWeb: "vasille-ssg",
        headTag: false,
        bodyTag: false,
    });
});

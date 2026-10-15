import { runJsxTest, throwTest } from "../run-test.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("static page", function () {
    runJsxTest(__dirname, "static");
});

it("dynamical page", function () {
    runJsxTest(__dirname, "(dynamical)");
});

it("folder static page", function () {
    runJsxTest(__dirname, "page/list");
});

it("folder dynamical page", function () {
    runJsxTest(__dirname, "page/(number)");
});

it("wrong path error", function () {
    throwTest(__dirname, "static", "Page path does not match the file path");
});

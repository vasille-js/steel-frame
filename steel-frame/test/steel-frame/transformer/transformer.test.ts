import { runTest } from "../run-test.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("no import", function () {
    runTest(__dirname, "no-import");
});

it("web global import", function () {
    runTest(__dirname, "web-global");
});

it("web style only import", function () {
    runTest(__dirname, "web-partial");
});

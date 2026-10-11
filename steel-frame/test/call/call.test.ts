import { runTest, throwTest } from "../run-test.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("string literal", function () {
    runTest(__dirname, "string-literal");
});

it("constant", function () {
    runTest(__dirname, "constant");
});

it("css", function () {
    runTest(__dirname, "css");
});

it("require context", function () {
    runTest(__dirname, "require-context");
});

it("awaited expect array pattern", function () {
    throwTest(__dirname, "awaited-not-arr", "Expected array pattern");
});

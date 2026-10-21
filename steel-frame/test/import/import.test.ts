import { runTest, throwTest } from "../run-test.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("global import", function () {
    runTest(__dirname, "global");
});

it("selective import", function () {
    runTest(__dirname, "selective");
});

it("override global", function () {
    runTest(__dirname, "override-global");
});

it("override by let", function () {
    runTest(__dirname, "override-by-let");
});

it("override by function", function () {
    runTest(__dirname, "override-by-function");
});

it("override by function expression", function () {
    throwTest(
        __dirname,
        "override-by-fn-expr",
        'Local function "compose" is not allowed to be used in variable declaration',
    );
});

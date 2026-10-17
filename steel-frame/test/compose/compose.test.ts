import { runTest, throwTest } from "../run-test.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("component test", function () {
    runTest(__dirname, "component");
});

it("compose test", function () {
    runTest(__dirname, "compose");
});

it("modal test", function () {
    runTest(__dirname, "modal");
});

it("model test", function () {
    runTest(__dirname, "model");
});

it("prompt test", function () {
    runTest(__dirname, "prompt");
});

it("store test", function () {
    runTest(__dirname, "store");
});

it("view test", function () {
    runTest(__dirname, "view");
});

it("screen test", function () {
    runTest(__dirname, "screen");
});

it("declared function in bind error", function () {
    throwTest(__dirname, "declared-function", 'Local function "foo" is not allowed to be used in variable declaration');
});

it("declared function in calculate error", function () {
    throwTest(
        __dirname,
        "declared-function-calculate",
        'Local function "foo" is not allowed to be used in variable declaration',
    );
});

it("declared function in effect error", function () {
    throwTest(
        __dirname,
        "declared-function-effect",
        'Local function "foo" is not allowed to be used in variable declaration',
    );
});

it("declared function not in live value", function () {
    runTest(__dirname, "declared-function");
});

it("declared function called in regular expression", function () {
    runTest(__dirname, "declared-function-call");
});

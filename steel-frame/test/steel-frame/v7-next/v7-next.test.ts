import { runJsxTest, runTest, throwTest } from "../run-test.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("writable to models", function () {
    runTest(__dirname, "writable-to-models");
});

it("writable to models dev", function () {
    runTest(__dirname, "writable-to-models-dev", { devLayer: true });
});

it("writable property", function () {
    runTest(__dirname, "writable-property");
});

it("writable array model view", function () {
    runJsxTest(__dirname, "writable-array-model-view");
});

it("writable array view", function () {
    runJsxTest(__dirname, "writable-array-view");
});

it("writable map model view", function () {
    runJsxTest(__dirname, "writable-map-model-view");
});

it("readonly writable err", function () {
    throwTest(__dirname, "readonly-writable", "Unexpected readonly reactive value. Expected a writable one.");
});

it("readonly writable size err", function () {
    throwTest(__dirname, "readonly-writable-size", "Unexpected readonly reactive value. Expected a writable one.");
});

it("no writable err", function () {
    throwTest(__dirname, "no-writable", "Expected writable reactive value here.");
});

it("writable from readonly", function () {
    throwTest(
        __dirname,
        "writable-from-readonly",
        'writable item in slot requires a writable collection. Renaming wr_item parameter to "item"',
        true,
    );
});

it("writable or passive", function () {
    throwTest(__dirname, "writable-or-passive", "Expected writable or non reactive parameter.", true);
});

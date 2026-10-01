import { runJsxTest, runTest } from "../run-test";

it("abort signal", function () {
  runJsxTest(__dirname, "abort-signal", false);
});

it("async composes", function () {
  runJsxTest(__dirname, "async-composing", false, { asyncComposing: true });
});

it("callback", function () {
  runJsxTest(__dirname, "callback", false);
});

it("field ref", function () {
  runJsxTest(__dirname, "field-ref", false);
});

it("object destruction", function () {
  runJsxTest(__dirname, "object-destruction", false);
});

it("HMR", function () {
  runTest(__dirname, "Hmr", true, false, { hmr: true });
});

it("safe", function () {
  runJsxTest(__dirname, "safe");
});

it("string event", function () {
  runJsxTest(__dirname, "string-event");
});

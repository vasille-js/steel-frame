import { runJsxTest, runTest, throwTest } from "../run-test";

it("abort signal", function () {
  runJsxTest(__dirname, "abort-signal");
});

it("async composes", function () {
  runJsxTest(__dirname, "async-composing", { asyncComposing: true });
});

it("callback", function () {
  runJsxTest(__dirname, "callback");
});

it("debounce", function () {
  runTest(__dirname, "debounce");
});

it("debounce dev", function () {
  runTest(__dirname, "debounce-dev", { devLayer: true });
});

it("field ref", function () {
  runJsxTest(__dirname, "field-ref");
});

it("object destruction", function () {
  runJsxTest(__dirname, "object-destruction");
});

it("HMR", function () {
  runTest(__dirname, "Hmr", { hmr: true, devLayer: true });
});

it("safe", function () {
  runJsxTest(__dirname, "safe");
});

it("string event", function () {
  runJsxTest(__dirname, "string-event");
});

it("field ref no argument", function () {
  throwTest(__dirname, "field-ref-no-arg", "fieldRef function must have one argument");
});

it("field ref no breakpoint", function () {
  throwTest(__dirname, "field-ref-no-breakpoint", "Failed to break value into fields");
});

it("field ref double breakpoint", function () {
  throwTest(__dirname, "field-ref-double-breakpoint", "Nested breakpoints are not allowed");
});

it("field ref has double breakpoint", function () {
  throwTest(__dirname, "field-ref-has-double-breakpoint", "Nested breakpoints are not allowed");
});

it("field ref with private name", function () {
  throwTest(__dirname, "field-ref-with-private-name", "Failed to break value into fields");
});

it("expr has double breakpoint", function () {
  throwTest(__dirname, "expr-has-double-breakpoint", "Nested reactivity is not supported");
});

it("debounce wrong args", function () {
  throwTest(
    __dirname,
    "debounce-wrong-args",
    "debounceRef() expects 2 arguments: a reactive value and a delay duration",
  );
});

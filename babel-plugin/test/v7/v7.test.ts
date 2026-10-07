import { runJsxTest, runTest, throwTest } from "../run-test";
import { AppData } from "../../src";

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

it("router", function () {
  runTest(__dirname, "router", {
    routes: [
      ["correct"],
      ["correct", "*", "item"],
      ["correct", "item", "*"],
      ["correct", "*", "item", "edit"],
      ["correct", "*", "item", "edit", "*"],
    ],
  });
});

it("auto safe", function () {
  runJsxTest(__dirname, "auto-safe");
});

it("array model map", function () {
  runJsxTest(__dirname, "array-model-map");
});

it("router path in jsx", function () {
  runJsxTest(__dirname, "router-path-in-jsx");
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

it("router goTo", function () {
  throwTest(__dirname, "router-go-to", 'Invalid router path "/wrong".', false, {
    routes: [["correct"]],
  });
});

it("router load", function () {
  throwTest(
    __dirname,
    "router-load",
    'Invalid router path "/wrong". Expected a path matching one of the defined routes.',
    false,
    {
      routes: [["correct"]],
    },
  );
});

it("wrong path in jsx", function () {
  throwTest(__dirname, "wrong-path-in-jsx", 'Invalid router path "/wrong".', true, {
    routes: [["correct"], ["correct", "*"]],
  });
});

it("array model map gives Array", function () {
  throwTest(__dirname, "array-model-map", "Mapped value must be and identifier initialized with array model", true);
});

it("provide and receive global dependency", function () {
  const appData = new AppData();

  runJsxTest(__dirname, "provide-global-dependency", { appData, filename: `${process.cwd()}/src/router/Wrapper.tsx` });
  throwTest(__dirname, "page-with-global-dependency", 'Missing dependencies: "unexisting"\n', true, { appData });
});

it("has local dependency flow", function () {
  throwTest(__dirname, "local-dependency-flow", 'Missing dependencies: "unexisting"\n', true);
});

it("dependency reexport check", function () {
  const appData = new AppData();

  runJsxTest(__dirname, "DependencyStart", { appData });
  runJsxTest(__dirname, "DependencyReexport", { appData });
  throwTest(__dirname, "dependency-reexport-check", 'Missing dependencies: "unexisting"\n', true, { appData });
});

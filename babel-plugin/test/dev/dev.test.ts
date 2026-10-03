import { runJsxTest, runTest } from "../run-test";

it("component", function () {
  runTest(__dirname, "component", { devLayer: true });
});

it("ref", function () {
  runTest(__dirname, "ref", { devLayer: true });
});

it("ref without args", function () {
  runTest(__dirname, "ref-no-args", { devLayer: true });
});

it("bind", function () {
  runTest(__dirname, "bind", { devLayer: true });
});

it("bind 2", function () {
  runTest(__dirname, "bind-2", { devLayer: true });
});

it("calculate", function () {
  runTest(__dirname, "calculate", { devLayer: true });
});

it("object", function () {
  runTest(__dirname, "object", { devLayer: true });
});

it("awaited", function () {
  runTest(__dirname, "awaited", { devLayer: true });
});

it("awaited 2", function () {
  runTest(__dirname, "awaited-2", { devLayer: true });
});

it("set model", function () {
  runTest(__dirname, "set-model", { devLayer: true });
});

it("map model", function () {
  runTest(__dirname, "map-model", { devLayer: true });
});

it("array model", function () {
  runTest(__dirname, "array-model", { devLayer: true });
});

it("ensure", function () {
  runTest(__dirname, "ensure", { devLayer: true });
});

it("set value", function () {
  runTest(__dirname, "set-value", { devLayer: true });
});

it("value assignment", function () {
  runTest(__dirname, "value-assignment", { devLayer: true });
});

it("function wrap", function () {
  runTest(__dirname, "function-wrap", { devLayer: true });
});

it("tag", function () {
  runJsxTest(__dirname, "tag", { devLayer: true });
});

it("text", function () {
  runJsxTest(__dirname, "text", { devLayer: true });
});

it("text 2", function () {
  runJsxTest(__dirname, "text-2", { devLayer: true });
});

it("child", function () {
  runJsxTest(__dirname, "child", { devLayer: true });
});

it("page", function () {
  runTest(__dirname, "page", { devLayer: true });
});

it("module level reactivity", function () {
  runTest(__dirname, "module-level-reactivity", { devLayer: true });
});

it("prompt", function () {
  runJsxTest(__dirname, "prompt", { devLayer: true });
});

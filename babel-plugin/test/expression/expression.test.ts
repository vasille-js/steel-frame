import { runTest, throwTest } from "../run-test";

it("check expression", function () {
  runTest(__dirname, "check-expression");
});

it("check fragment error", function () {
  throwTest(__dirname, "jsx-fragment", "JSX fragment is not allowed here", true);
});

it("check element error", function () {
  throwTest(__dirname, "jsx-element", "JSX element is not allowed here", true);
});

it("check statements", function () {
  runTest(__dirname, "check-statement");
});

it("reactive field set", function () {
  runTest(__dirname, "reactive-field-set");
});

it("nested observable error", function () {
  throwTest(__dirname, "nested-observable", "Nested reactivity is not supported");
});

it("local observable error", function () {
  throwTest(__dirname, "local-observable", "Reactive properties are not allowed in computed objects");
});

it("mesh lvalue", function () {
  runTest(__dirname, "mesh-lvalue");
});

it("stringify", function () {
  runTest(__dirname, "stringify");
});

it("check node", function () {
  runTest(__dirname, "check-node");
});

it("dependency", function () {
  runTest(__dirname, "dependency");
});

it("deep reactive object", function () {
  runTest(__dirname, "deep-reactive-object");
});

it("restricted hints error", function () {
  throwTest(__dirname, "restricted-hint", 'Usage of hint "arrayModel" is restricted here');
});

it("function name starts with $", function () {
  throwTest(__dirname, "function-name", "Non-reactive variable name must not start with $");
});

it("has nested observable in object", function () {
  throwTest(__dirname, "nested-observable-in-object", "Nested reactivity is not supported");
});

it("has nested reactivity", function () {
  throwTest(__dirname, "nested-reactivity", "Reactive properties are not allowed in computed objects");
});

it("has nested reactivity 2", function () {
  throwTest(__dirname, "nested-reactivity-2", "Reactive properties are not allowed in computed objects");
});

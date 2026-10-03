import { runJsxTest, runTest, throwTest } from "../run-test";

it("compose function", function () {
  runJsxTest(__dirname, "compose");
});

it("mesh statement function", function () {
  runTest(__dirname, "mesh-statement");
});

it("mesh expression function", function () {
  runTest(__dirname, "mesh-expression");
});

it("class", function () {
  runTest(__dirname, "class");
});

it("export default class", function () {
  runTest(__dirname, "default-class");
});

it("export default function", function () {
  runTest(__dirname, "default-fn");
});

it("export default expression", function () {
  runTest(__dirname, "default-expr");
});

it("run on destroy", function () {
  runTest(__dirname, "run-on-destroy");
});

it("reactive field set", function () {
  runTest(__dirname, "reactive-field-set");
});

it("reactive field copy", function () {
  runTest(__dirname, "reactive-field-copy");
});

it("store function", function () {
  runJsxTest(__dirname, "store");
});

it("reactive object status track", function () {
  runJsxTest(__dirname, "reactive-object");
});

it("invalid compose call error", function () {
  throwTest(__dirname, "invalid-compose-call", "Invalid arguments");
});

it("style hint error", function () {
  throwTest(__dirname, "style-hint", 'Usage of hint "prefersDark" is restricted here');
});

it("calculate call error", function () {
  throwTest(__dirname, "calculate-call", "Argument of calculate must be a function");
});

it("store reactive value name error", function () {
  throwTest(__dirname, "store-reactive-value", "Reactivity mismatch between field name and value");
});

it("store not reactive value name error", function () {
  throwTest(__dirname, "store-not-reactive-value", "Method name can not start with $");
});

it("store not reactive value name error 2", function () {
  throwTest(__dirname, "store-not-reactive-value-2", "Method name can not start with $");
});

it("jsx fragment error", function () {
  throwTest(__dirname, "jsx-fragment", "JSX fragment is not allowed here", true);
});

it("jsx element error", function () {
  throwTest(__dirname, "jsx-element", "JSX element is not allowed here", true);
});

it("store jsx error", function () {
  throwTest(__dirname, "store-jsx", "JSX is not allowed in states", true);
});

it("array model not const error", function () {
  throwTest(__dirname, "array-model-const", "Array models must be declared as constants");
});

it("map model not const error", function () {
  throwTest(__dirname, "map-model-const", "Map models must be declared as constants");
});

it("set model not const error", function () {
  throwTest(__dirname, "set-model-const", "Set models must be declared as constants");
});

it("compose wrong arg number error", function () {
  throwTest(__dirname, "compose-arg-number", "Extra parameters are not allowed", true);
});

it("compose nested destruction error", function () {
  throwTest(__dirname, "compose-nested-destruction", "You can not destruct a reactive value");
});

it("run on destroy error", function () {
  throwTest(__dirname, "run-on-destroy", "Stores/Models in Vasille.JS are not destroyable");
});

it("param name starts with $", function () {
  throwTest(__dirname, "param-name", "Non-reactive variable name must not start with $");
});

it("param name in array destruction starts with $", function () {
  throwTest(__dirname, "param-name-destruction", "Non-reactive variable name must not start with $");
});

it("param name of rest element starts with $", function () {
  throwTest(__dirname, "param-name-rest", "Non-reactive variable name must not start with $");
});

it("param name with default value starts with $", function () {
  throwTest(__dirname, "param-name-with-default-value", "Non-reactive variable name must not start with $");
});

it("function name starts with $", function () {
  throwTest(__dirname, "function-name", "Non-reactive variable name must not start with $");
});

it("class name starts with $", function () {
  throwTest(__dirname, "class-name", "Non-reactive variable name must not start with $");
});

it("class expression name starts with $", function () {
  throwTest(__dirname, "class-name-expression", "Non-reactive variable name must not start with $");
});

it("prompt called outside of context", function () {
  throwTest(__dirname, "prompt", 'Usage of hint "showPrompt" is restricted here');
});

it("double mesh bug", function () {
  runJsxTest(__dirname, "double-mesh-bug");
});

it("object reference", function () {
  runTest(__dirname, "object-reference");
});

it("object computed property", function () {
  runTest(__dirname, "object-computed-property");
});

it("object read property", function () {
  runTest(__dirname, "object-read-property");
});

it("computed properties in destruction", function () {
  throwTest(__dirname, "computed-property-in-destruction", "Computed property can not be used in destruction");
});

it("store share dependency", function () {
  throwTest(__dirname, "store-share-dependency", "Stores/Models in Vasille.JS cannot share dependencies");
});

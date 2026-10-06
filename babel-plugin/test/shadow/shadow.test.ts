import { runJsxTest, runTest, throwTest } from "../run-test";

const extra = { shadow: true, replaceWeb: "vasille-shadow", noPrefix: true };

function ts(name: string) {
  runTest(__dirname, name, extra);
}
function tsx(name: string) {
  runJsxTest(__dirname, name, extra);
}

it("shadow props parsing", function () {
  ts("PropsTest");
});

it("shadow props in interface parsing", function () {
  ts("InterfaceTest");
});

it("shadow parameters type parsing", function () {
  ts("ParameterTest");
});

it("type alias parsing", function () {
  ts("TypeTest");
});

it("type union parsing", function () {
  ts("UnionTest");
});

it("slots", function () {
  tsx("SlotTest");
});

it("local components", function () {
  tsx("LocalComponent");
});

it("no - error", function () {
  throwTest(__dirname, "Error", "The name 'error' is not allowed by WHATWG", true, extra);
});

it("restricted tag name error", function () {
  throwTest(__dirname, "MissingGlyph", "The name 'missing-glyph' is not allowed by WHATWG", true, extra);
});

it("no type error", function () {
  throwTest(__dirname, "NoType", "Missing type for web component composition", true, extra);
});

it("missing type error", function () {
  throwTest(__dirname, "MissingType", "Missing type for web component composition", true, extra);
});

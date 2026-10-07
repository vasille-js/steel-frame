import { runJsxTest, runTest, throwTest } from "../run-test";
import { AppData } from "../../src";

it("assign operator", function () {
  runTest(__dirname, "assign-operator");
});

it("spaces in jsx", function () {
  runJsxTest(__dirname, "spaces-in-jsx");
});

it("array index", function () {
  runTest(__dirname, "array-index");
});

it("context", function () {
  let appData = new AppData();

  runTest(__dirname, "context", { appData });

  appData.testComponent("babel-plugin-vasille/test/v5/context:C", data => {
    expect([...data.requiredDependencies]).toEqual(["babel-plugin-vasille/test/v5/context:Context"]);
    expect([...data.providedDependencies]).toEqual(["babel-plugin-vasille/test/v5/context:Context"]);
  });
  expect(() => appData.testComponent("C", () => {})).toThrow("Component C not found");
});

it("DI discover fails", function () {
  throwTest(
    __dirname,
    "di-discover",
    "First argument must be string literal, class name, Context instance or imported/exported symbol",
  );
});

it("restricted receive in Wrapper.tsx", function () {
  throwTest(__dirname, "receive-in-wrapper", "receive() is not allowed in wrapper components", false, {
    filename: `${process.cwd()}/src/router/Wrapper.tsx`,
  });
});

it("dependency injection", function () {
  runJsxTest(__dirname, "di");
});

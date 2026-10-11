import { runJsxTest, runTest, throwTest } from "../run-test.js";
import { AppData } from "../../src/babel-plugin/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    appData.testComponent("steel-frame/test/v5/context:C", data => {
        expect([...data.requiredDependencies]).toEqual(["steel-frame/test/v5/context:Context"]);
        expect([...data.providedDependencies]).toEqual(["steel-frame/test/v5/context:Context"]);
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

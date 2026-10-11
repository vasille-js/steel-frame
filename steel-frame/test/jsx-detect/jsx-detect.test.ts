import { runJsxTest } from "../run-test.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("has JSX", function () {
    runJsxTest(__dirname, "has-jsx");
});

it("release mode", function () {
    runJsxTest(__dirname, "release-mode");
});

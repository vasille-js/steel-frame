import { runTest, throwTest } from "../run-test.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("incorrect number of arguments error", function () {
    throwTest(__dirname, "incorrect-args-number", "Incorrect number of arguments");
});

it("incorrect number of properties error", function () {
    throwTest(__dirname, "incorrect-props-number", "Argument of calculate cannot have parameters");
});

it("first argument id not a function error", function () {
    throwTest(__dirname, "arg-not-func", "Argument of calculate must be a function");
});

it("malformed component error", function () {
    throwTest(__dirname, "malformed-component", "Malformed component detected");
});

it("file structure: helper before export error", function () {
    throwTest(__dirname, "file-structure-helper-before-export", "Malformed file structure detected");
});

it("file structure: styleSheet not last error", function () {
    throwTest(__dirname, "file-structure-stylesheet-not-last", "Malformed file structure detected");
});

it("file structure: import after statements error", function () {
    throwTest(__dirname, "file-structure-import-after", "Malformed file structure detected");
});

it("file structure: unexpecred class", function () {
    throwTest(__dirname, "file-structure-class", "Malformed file structure detected");
});

it("file structure: correct", function () {
    runTest(__dirname, "FileStructure");
});

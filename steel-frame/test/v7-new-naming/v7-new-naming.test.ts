import { fileURLToPath } from "node:url";
import { runJsxTest, throwTest } from "../run-test.js";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it("test naming", function () {
    runJsxTest(__dirname, "naming");
});

it("let x = debounced(..)", function () {
    throwTest(__dirname, "let-debounced", 'Expected "readonly" reactivity mark, the "wr_2" has "writable" mark');
});

it("let r_ = ref(..)", function () {
    throwTest(
        __dirname,
        "readonly-explicit-ref",
        'Expected "writable" reactivity mark, the name "r_" has "readonly" mark',
    );
});

it("let r_ = ..", function () {
    throwTest(__dirname, "readonly-ref", 'Expected "writable" reactivity mark, the name "r_" has "readonly" mark');
});

it("const r_ = field(..)", function () {
    throwTest(__dirname, "readonly-field", 'Expected "writable" reactivity mark, the name "r_2" has "readonly" mark');
});

it("{wr_: r_}", function () {
    throwTest(__dirname, "readonly-to-writable-prop", "Writable field are not allowed in objects");
});

it("<C wr_={r_} ..", function () {
    throwTest(__dirname, "readonly-to-writable-prop", "Reactive writable property requires writable value", true);
});

it("let wr_ = debounced(..)", function () {
    throwTest(__dirname, "writable-debounced", 'Expected "readonly" reactivity mark, the "wr_2" has "writable" mark');
});

it("let wr_ = live(..)", function () {
    throwTest(
        __dirname,
        "writable-explicit-expr",
        'Expected "readonly" reactivity mark, the "wr_2" has "writable" mark',
    );
});

it("const wr_ = $r + 1", function () {
    throwTest(__dirname, "writable-expr", 'Expected "readonly" reactivity mark, the "wr_2" has "writable" mark');
});

it("const obj = {r_: ..}", function () {
    throwTest(__dirname, "reactive-field-in-obj", "Writable field are not allowed in objects");
});

it("const obj = {wr_: ..}", function () {
    throwTest(__dirname, "reactive-writable-in-obj", "Writable field are not allowed in objects");
});

it("this.wr_ = props.r_", function () {
    throwTest(__dirname, "constructor-reactivity-missmatch", "Cannot assign readonly reactive value to writable");
});

it("r_ = ..", function () {
    throwTest(__dirname, "assign-to-readonly", "Writing to readonly reactive values is forbidden");
});

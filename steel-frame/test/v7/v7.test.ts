import { runJsxTest, runTest, throwTest } from "../run-test.js";
import { AppData } from "../../src/babel-plugin/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

it("field ref v4 naming", function () {
    runJsxTest(__dirname, "field-ref");
});

it("field ref v7 naming", function () {
    runJsxTest(__dirname, "field-ref-v7-naming");
});

it("field ref v7 naming to r_ property error", function () {
    throwTest(
        __dirname,
        "field-ref-v7-naming",
        '"field" hint composes a writable reactive value, but property "r_a" is readonly',
        true,
    );
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
    throwTest(__dirname, "field-ref-double-breakpoint", "Nested reactivity is not supported");
});

it("field ref has double breakpoint", function () {
    throwTest(__dirname, "field-ref-has-double-breakpoint", "Nested reactivity is not supported");
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

    runJsxTest(__dirname, "provide-global-dependency", {
        appData,
        filename: `${process.cwd()}/src/router/Wrapper.tsx`,
    });
    throwTest(__dirname, "page-with-global-dependency", 'Missing dependencies: "unexisting"\n', true, { appData });
});

it("has local dependency flow", function () {
    throwTest(__dirname, "local-dependency-flow", 'Missing dependencies: "unexisting"\n', true);
});

it("dependency reexport check", function () {
    const appData = new AppData();
    const mapping = new Map<string, string>();

    runJsxTest(__dirname, "DependencyStart", { appData, typeIdentifiersMapping: mapping });
    runJsxTest(__dirname, "DependencyReexport", { appData });
    throwTest(__dirname, "dependency-reexport-check", 'Missing dependencies: "unexisting"\n', true, { appData });

    expect(mapping.get("Reference")).toBe("vasille/build/index:Reference");
});

it("static live value", function () {
    throwTest(__dirname, "static-live-value", "Unexpected reactivity mark in variable name");
});

it("rest element in reactive destruction", function () {
    throwTest(__dirname, "rest-in-reactive-destruction", "Rest element is not allowed in object destructuring");
});

it("destruction missing renaming", function () {
    throwTest(__dirname, "destruction-missing-renaming", "Reactive object destruction required renaming of fields.");
});

it("destruction extracts reactive", function () {
    throwTest(
        __dirname,
        "destruction-extracts-reactive",
        "Reactive field can not be extracted from a reactive object using destruction",
    );
});

it("computed property restriction", function () {
    throwTest(__dirname, "computed-property", "Computed property can not be used in object");
});

it("restricted reference in object", function () {
    throwTest(__dirname, "restricted-ref-in-object", "This object can not contain reactive fields");
});

it("restricted ref() in object", function () {
    throwTest(__dirname, "restricted-ref-in-object-2", "This object can not contain reactive fields");
});

it("rest element in internal slot", function () {
    throwTest(__dirname, "rest-in-internal-slot", "Rest element can not be used in slots of internal components", true);
});

it("destruction of internal slot props", function () {
    throwTest(__dirname, "destruction-of-slot-props", "Extract reactive fields inside the function body", true);
});

it("safeInit with no args", function () {
    throwTest(__dirname, "safe-init-no-args", "safeInit takes only one argument");
});

it("throws auto-unwrap error", function () {
    throwTest(
        __dirname,
        "autounwrap",
        "The reactivity breaks here, unwrap intentionally the reactive value, or use non reactive one",
        true,
    );
});

it("rest element in ref call", function () {
    throwTest(__dirname, "rest-in-ref", "Invalid arguments: expected expression");
});

it("restricted member access in expression", function () {
    throwTest(
        __dirname,
        "restricted-member-access",
        "Reactive member access are not allowed in bind/computed expressions.",
    );
});

it("breaks reactivity in watch", function () {
    throwTest(__dirname, "reactivity-break", "Assigment are forbidden in live values and effects");
});

it("breaks reactivity in function", function () {
    throwTest(__dirname, "reactivity-break-2", "This assignment breaks the reactivity");
});

it("effect with no dependencies", function () {
    throwTest(__dirname, "no-deps-in-effect", "Effect must have at least one dependency. Move code to beforeMount");
});

it("discards await", function () {
    runTest(__dirname, "discard-awaited");
});

it("catches dependency in await", function () {
    runTest(__dirname, "await-with-dependency");
});

it("has no await in awaited", function () {
    runTest(__dirname, "discard-less-awaited");
});

it("let with function expression", function () {
    runTest(__dirname, "let-with-function-expression");
});

it("bypass write restriction", function () {
    runTest(__dirname, "bypass-write-restriction");
});

it("bypass to readonly error", function () {
    throwTest(
        __dirname,
        "bypass-to-readonly",
        "The bypassWriteRestriction hint expected a writable reactive value as first argument and an expression as second argument",
    );
});

it("declared function in bind error", function () {
    throwTest(__dirname, "declared-function", 'Local function "foo" is not allowed to be used in variable declaration');
});

it("declared function in calculate error", function () {
    throwTest(
        __dirname,
        "declared-function-calculate",
        'Local function "foo" is not allowed to be used in variable declaration',
    );
});

it("declared function in effect error", function () {
    throwTest(
        __dirname,
        "declared-function-effect",
        'Local function "foo" is not allowed to be used in variable declaration',
    );
});

it("declared function not in varaible declaration", function () {
    runTest(__dirname, "declared-function");
});

it("declared function called in regular variable declaration", function () {
    throwTest(
        __dirname,
        "declared-function-call",
        'Local function "foo" is not allowed to be used in variable declaration',
    );
});

it("function expression in variable declaration", function () {
    throwTest(
        __dirname,
        "function-expr-in-var-declaration",
        "Function expression in reactive variable declaration must not capture outer scope",
    );
});

it("function expression in state declaration", function () {
    throwTest(
        __dirname,
        "function-expr-in-state-declaration",
        "Function expression in reactive variable declaration must not capture outer scope",
    );
});

it("function expression in live declaration", function () {
    throwTest(__dirname, "function-expr-in-live-declaration", "Function expressions can not be used as live values");
});

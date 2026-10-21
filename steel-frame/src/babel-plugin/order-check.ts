import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";
import { calls, dynamicModulesFunctions, FnNames } from "./call.js";
import { Internal } from "./internal.js";
import { err, Errors } from "./lib.js";

interface OrderItem {
    nodeType?: types.Node["type"][];
    calls?: FnNames[];
}

const componentOrder = [
    { nodeType: ["VariableDeclaration"] },
    { calls: ["watch", "effect"] },
    { calls: ["share"] },
    { nodeType: ["FunctionDeclaration"] },
    { calls: ["beforeMount"] },
    { nodeType: ["JSXElement", "JSXFragment"] },
    { calls: ["afterMount"] },
    { calls: ["beforeDestroy"] },
    { nodeType: ["ReturnStatement"] },
] as const satisfies OrderItem[];

function matchStatement(path: NodePath<types.Statement | null | undefined>, target: OrderItem, internal: Internal) {
    const testPath = path.isExpressionStatement() ? path.get("expression") : path;

    if (target.nodeType && testPath.node) {
        return target.nodeType.includes(testPath.node.type);
    }

    if (target.calls && testPath.isExpression()) {
        return calls(testPath, target.calls, internal);
    }

    return false;
}

export function checkOrder(paths: NodePath<types.Statement | null | undefined>[], internal: Internal) {
    let index = 0;

    for (const path of paths) {
        while (index < componentOrder.length && !matchStatement(path, componentOrder[index], internal)) {
            index++;
        }

        if (index === componentOrder.length) {
            err(
                Errors.RulesOfVasille,
                path,
                [
                    "Malformed component detected, required component structure is:",
                    "1. Variable declarations.",
                    "2. Watchers/effects (calls of `effect` function).",
                    "3. Dependency sharing (calls of `share` function).",
                    "4. Function declarations.",
                    "5. Before mount hint (call of `beforeMount` function)",
                    "6. JSX elements and fragments",
                    "7. After mount hint (call of `afterMount` function)",
                    "8. Before destroy hint (call of `beforeDestroy` function)",
                    "9. Return statement",
                    "All steps are optional, but the order is strict.",
                    "Unlisted statements are not accepted.",
                ].join("\n"),
                internal,
            );
        }
    }
}

const fileOrder = ["imports", "types", "export", "helper", "styleSheet"] as const;

type FileSection = (typeof fileOrder)[number];

const fileStructureMessage = [
    "Malformed file structure detected, required file structure is:",
    "1. Imports.",
    "2. TypeScript types and interfaces.",
    "3. Export of component/view/page/modal/...",
    "4. Helper module-level functions and variables.",
    "5. `const css = styleSheet()` call (must be the last statement).",
    "All sections are optional, but the order is strict.",
    "Unlisted statements are not accepted.",
].join("\n");

function isStyleSheetDeclaration(path: NodePath<types.VariableDeclaration>, internal: Internal): boolean {
    for (const declarator of path.get("declarations")) {
        const init = declarator.get("init");
        if (init && calls(init, ["styleSheet"], internal)) {
            return true;
        }
    }

    return false;
}

function isComponentCall(
    path: NodePath<types.Expression | null | undefined>,
    internal: Internal,
): path is NodePath<types.CallExpression> {
    return calls(path, dynamicModulesFunctions, internal);
}

function isComponentDeclaration(path: NodePath<types.VariableDeclaration>, internal: Internal): boolean {
    for (const declarator of path.get("declarations")) {
        const init = declarator.get("init");
        if (init && isComponentCall(init, internal)) {
            return true;
        }
    }

    return false;
}

function isExportedComponent(
    path: NodePath<types.Statement>,
    internal: Internal,
    componentNames: Set<string>,
): boolean {
    if (path.isExportDefaultDeclaration()) {
        const declaration = path.get("declaration");
        return declaration.isCallExpression() && isComponentCall(declaration, internal);
    }

    /* istanbul ignore else */
    if (path.isExportNamedDeclaration()) {
        const declaration = path.get("declaration");

        if (declaration.isVariableDeclaration()) {
            return isComponentDeclaration(declaration, internal);
        }
    }

    return false;
}

function categorizeStatement(
    path: NodePath<types.Statement>,
    internal: Internal,
    componentNames: Set<string>,
): FileSection | null {
    const node = path.node;

    if (node.type === "ImportDeclaration") {
        return "imports";
    }

    if (node.type === "TSTypeAliasDeclaration" || node.type === "TSInterfaceDeclaration") {
        return "types";
    }

    if (node.type === "ExportNamedDeclaration" || node.type === "ExportDefaultDeclaration") {
        return isExportedComponent(path, internal, componentNames) ? "export" : "helper";
    }

    if (path.isVariableDeclaration()) {
        if (isStyleSheetDeclaration(path, internal)) {
            return "styleSheet";
        }
        return "helper";
    }

    if (node.type === "FunctionDeclaration") {
        return "helper";
    }

    return null;
}

function collectComponentNames(paths: NodePath<types.Statement>[], internal: Internal): Set<string> {
    const names = new Set<string>();

    for (const path of paths) {
        if (path.isVariableDeclaration()) {
            for (const declarator of path.get("declarations")) {
                const id = declarator.get("id");
                const init = declarator.get("init");
                if (id.isIdentifier() && init && isComponentCall(init, internal)) {
                    names.add(id.node.name);
                }
            }
        }
    }

    return names;
}

function hasExportedComponent(
    paths: NodePath<types.Statement>[],
    internal: Internal,
    componentNames: Set<string>,
): boolean {
    for (const path of paths) {
        if (path.isExportNamedDeclaration() || path.isExportDefaultDeclaration()) {
            if (isExportedComponent(path, internal, componentNames)) {
                return true;
            }
        }
    }

    return false;
}

export function checkFileOrder(path: NodePath<types.Program>, internal: Internal) {
    const paths = path.get("body");
    const componentNames = collectComponentNames(paths, internal);

    if (!hasExportedComponent(paths, internal, componentNames)) {
        return;
    }

    let index = 0;

    for (const statementPath of paths) {
        const section = categorizeStatement(statementPath, internal, componentNames);

        if (section !== null) {
            while (index < fileOrder.length && fileOrder[index] !== section) {
                index++;
            }
        }

        if (section === null || index === fileOrder.length) {
            err(Errors.RulesOfVasille, statementPath, fileStructureMessage, internal);
        }
    }
}

export function collectComponents(paths: NodePath<types.Statement>[], internal: Internal): void {
    for (const path of paths) {
        if (path.isVariableDeclaration()) {
            for (const declarator of path.get("declarations")) {
                const id = declarator.get("id");
                const init = declarator.get("init");
                if (id.isIdentifier() && init && isComponentCall(init, internal)) {
                    internal.declaredComponents.set(id.node.name, path);
                }
            }
        }
    }
}

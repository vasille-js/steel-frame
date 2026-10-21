import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";

function pathHasAwait(path: NodePath<types.Node | null | undefined>) {
    let has = path.isAwaitExpression();

    path.traverse({
        AwaitExpression() {
            has = true;
        },
    });

    return has;
}

export function abortStatements(paths: NodePath<types.Statement>[], abortsCheck: types.Expression) {
    let result = false;
    for (const path of paths) {
        result = abortStatement(path, abortsCheck) || result;
    }
    return result;
}

export function abortExpression(
    path: NodePath<types.Expression | null | undefined>,
    abortsCheck: types.Expression,
): boolean {
    if (pathHasAwait(path) && path.node) {
        path.replaceWith(
            t.logicalExpression("&&", path.node, t.logicalExpression("||", abortsCheck, t.identifier("true"))),
        );
        return true;
    }
    return false;
}

export function abortStatement(
    path: NodePath<types.Statement | null | undefined>,
    abortsCheck: types.Expression,
): boolean {
    const statement = path.node;
    let result = false;

    if (!statement) {
        return result;
    }

    switch (statement.type) {
        case "BlockStatement":
            result = abortStatements((path as NodePath<types.BlockStatement>).get("body"), abortsCheck) || result;
            break;

        case "DoWhileStatement": {
            const _path = path as NodePath<types.DoWhileStatement>;

            result = abortExpression(_path.get("test"), abortsCheck) || result;
            result = abortStatement(_path.get("body"), abortsCheck) || result;
            break;
        }
        case "ExpressionStatement":
            if (pathHasAwait(path)) {
                path.insertAfter(abortsCheck);
                result = true;
            }
            break;

        case "ForInStatement": {
            const _path = path as NodePath<types.ForInStatement>;

            result = abortStatement(_path.get("body"), abortsCheck) || result;
            break;
        }
        case "ForOfStatement": {
            const _path = path as NodePath<types.ForOfStatement>;
            result = abortStatement(_path.get("body"), abortsCheck) || result;
            if (_path.node.await && t.isBlockStatement(_path.node.body)) {
                _path.node.body.body.push(t.expressionStatement(abortsCheck));
                result = true;
            }
            break;
        }
        case "ForStatement": {
            const _path = path as NodePath<types.ForStatement>;

            result = abortStatement(_path.get("body"), abortsCheck) || result;
            break;
        }
        case "IfStatement": {
            const _path = path as NodePath<types.IfStatement>;

            result = abortExpression(_path.get("test"), abortsCheck) || result;
            result = abortStatement(_path.get("consequent"), abortsCheck) || result;
            result = abortStatement(_path.get("alternate"), abortsCheck) || result;
            break;
        }

        case "LabeledStatement":
            result = abortStatement((path as NodePath<types.LabeledStatement>).get("body"), abortsCheck) || result;
            break;

        case "ReturnStatement":
            break;

        case "SwitchStatement": {
            const _path = path as NodePath<types.SwitchStatement>;

            for (const _case of _path.get("cases")) {
                result = abortExpression(_case.get("test"), abortsCheck) || result;
                result = abortStatements(_case.get("consequent"), abortsCheck) || result;
            }
            break;
        }
        case "ThrowStatement":
            break;

        case "TryStatement":
            const handlerPath = (path as NodePath<types.TryStatement>).get("handler");

            result = abortStatement((path as NodePath<types.TryStatement>).get("block"), abortsCheck) || result;
            /* istanbul ignore else */
            if (handlerPath.node && result && t.isIdentifier(handlerPath.node.param)) {
                handlerPath.node.body.body.unshift(
                    t.ifStatement(
                        t.binaryExpression("instanceof", handlerPath.node.param, t.identifier("AbortError")),
                        t.throwStatement(handlerPath.node.param),
                    ),
                );
            }
            break;

        case "VariableDeclaration": {
            const _path = path as NodePath<types.VariableDeclaration>;

            if (pathHasAwait(path)) {
                _path.insertAfter(abortsCheck);
                result = true;
            }
            break;
        }
        case "WhileStatement": {
            const _path = path as NodePath<types.WhileStatement>;

            result = abortExpression(_path.get("test"), abortsCheck) || result;
            result = abortStatement(_path.get("body"), abortsCheck) || result;
            break;
        }
    }

    return result;
}

export function abortFunction(
    path: NodePath<types.ArrowFunctionExpression | types.FunctionExpression>,
    abortsCheck: types.Expression,
): boolean {
    const node = path.node;

    if (t.isBlockStatement(node.body)) {
        const bodyPath = path.get("body") as NodePath<types.BlockStatement>;

        return abortStatement(bodyPath, abortsCheck);
    }

    return false;
}

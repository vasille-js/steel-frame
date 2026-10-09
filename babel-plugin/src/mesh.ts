import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";
import {
  asyncFunctions,
  bindFunctions,
  calledFn,
  calls,
  composeFunctions,
  dynamicModulesFunctions,
  FnNames,
  hintFunctions,
  isDiCall,
  modelFunctions,
  refFunctions,
  unwrapFunctions,
} from "./call.js";
import { exprIsSure, idIsIValue, memberIsIValue, nodeIsMeshed } from "./expression.js";
import { ctx, InterfaceData, Internal, V, VariablesStatus, VariableState } from "./internal.js";
import { ConditionCollection, processConditions, transformJsx } from "./jsx.js";
import {
  checkNonReactiveName,
  checkReactiveName,
  err,
  Errors,
  exprCall,
  parseCalculateCall,
  pathIsReactiveValue,
  processModelCall,
  ref,
  removeExtension,
  toKebabCase,
} from "./lib.js";
import { checkOrder } from "./order-check";
import { routerReplace } from "./router";
import { stringify } from "./utils";
import { nodeToStaticPosition } from "./transformer";
import { fieldDataToObjectExpression, obtainInterfaceData, processInterface } from "./process-types";
import { meshAssigment } from "./operators";
import { hasBreakPoint, processDebounceRefCall, processFieldRefCall, toFieldRef } from "./field-reference";
import path from "path";
import module from "node:module";
import fs from "fs";

/**
 * Resolve a re-export source path to a steel-file-path-like identifier.
 * Converts relative paths and @/ aliases into a form compatible with steelFilePath.
 */
export function resolveSourceFilePath(sourcePath: string, internal: Internal): string | undefined {
  let resolved: string | undefined;

  // @/alias -> package name + rest of path (replace @/ with package name, then normalize)
  if (sourcePath.startsWith("@/")) {
    resolved = internal.packageName + "/src" + removeExtension(sourcePath.substring(1));
  }
  // Relative path: resolve relative to the importing file
  else if (sourcePath.startsWith(".")) {
    resolved = removeExtension(path.join(path.dirname(internal.steelFilePath), sourcePath));
  }
  // Bare module specifier, detect export for browsers
  else {
    const packageJson = module.findPackageJSON(sourcePath, __filename);
    const packageJsonContent = packageJson && JSON.parse(fs.readFileSync(packageJson, "utf8"));
    const relativePath = packageJsonContent?.exports?.browser ?? packageJsonContent?.exports?.["."]?.browser;

    /* istanbul ignore else */
    if (relativePath) {
      resolved = removeExtension(path.join(packageJsonContent.name, relativePath));
    }
  }

  return resolved;
}

export function meshOrIgnoreAllExpressions<T extends types.Node>(
  nodePaths: NodePath<types.Expression | null | T>[],
  internal: Internal,
  canHasRef: boolean,
) {
  for (const path of nodePaths) {
    /* istanbul ignore else */
    if (path.isExpression()) {
      meshExpression(path, internal, canHasRef);
    }
  }
}

export function processRefCall(
  path: NodePath<types.Node | null | undefined>,
  area: types.Node,
  internal: Internal,
  name?: string,
): boolean {
  const called = calledFn(path, refFunctions, internal);

  if (called) {
    const argument = path.get("arguments")[0];

    if (argument && !argument.isExpression()) {
      err(Errors.IncorrectArguments, path, "Invalid arguments: expected expression", internal);
    } else {
      if (argument) {
        meshExpression(argument, internal, false);
      }
      path.replaceWith(ref(argument?.node, internal, area, name, called === "safeState"));

      return true;
    }
  }

  return false;
}

export function meshAllExpressions(
  nodePaths: NodePath<types.Expression | null>[],
  internal: Internal,
  canHasRef: boolean,
) {
  for (const path of nodePaths) {
    meshExpression(path, internal, canHasRef);
  }
}

const restrictedNames = [
  "annotation-xml",
  "color-profile",
  "font-face",
  "font-face-src",
  "font-face-uri",
  "font-face-format",
  "font-face-name",
  "missing-glyph",
];

export function meshComposeCall(
  name: string | null | undefined,
  path: NodePath<types.Node | null | undefined>,
  method: FnNames,
  internal: Internal,
  isExported = false,
) {
  const args = path.isCallExpression() && path.get("arguments");
  const arg = args && args[0] && (args[0].isFunctionExpression() || args[0].isArrowFunctionExpression()) && args[0];

  if (!args || !arg || args.length !== 1) {
    return err(Errors.IncorrectArguments, path, "Invalid arguments number", internal);
  }

  if (name || t.isExportDeclaration(path.parent)) {
    const tracking = (internal.componentTracking = internal.appData?.registerComponent(internal, name ?? "default"));

    if (tracking || internal.shadow) {
      const firstParam = (arg.node as types.FunctionExpression).params[0];
      let interfaceData: InterfaceData | undefined;

      if (path.isCallExpression() && path.node.typeParameters?.params?.[0]) {
        interfaceData = obtainInterfaceData(path.node.typeParameters.params[0], internal);
      }
      if (
        t.isFunctionParameter(firstParam) &&
        !t.isVoidPattern(firstParam) &&
        t.isTSTypeAnnotation(firstParam.typeAnnotation)
      ) {
        interfaceData = obtainInterfaceData(firstParam.typeAnnotation.typeAnnotation, internal);
      }

      if (tracking && interfaceData) {
        tracking.setOptionalProps(interfaceData.optionalProperties);
      }

      if (internal.shadow && isExported && name) {
        const kebabName = toKebabCase(name);

        if (kebabName.indexOf("-") === -1 || restrictedNames.indexOf(kebabName) !== -1) {
          err(Errors.ParserError, path, `The name '${kebabName}' is not allowed by WHATWG`, internal);
        }

        if (interfaceData?.fields) {
          path.node.arguments.push(t.stringLiteral(kebabName), fieldDataToObjectExpression(interfaceData.fields));
        } else {
          err(Errors.RulesOfVasille, path, "Missing type for web component composition", internal);
        }
      }
    }
  }

  compose(arg, internal, method, false, false, false);
  arg.node.params.unshift(ctx);

  if (internal.devLayer && path.isCallExpression()) {
    path.node.arguments.push(nodeToStaticPosition(path.node), t.stringLiteral(name ? name : "#"));
  }

  const isWrapper = internal.isWrapper;

  if ((method === "page" || isWrapper) && internal.componentTracking) {
    const missingDependencies = internal.componentTracking.missingDependencies();

    if (missingDependencies.length) {
      err(Errors.ParserError, path, `Missing dependencies: ${missingDependencies.join(", ")}`, internal);
    }
  }
}

export function meshAllUnknown(
  paths: NodePath<types.SpreadElement | types.ArgumentPlaceholder | types.Expression | null>[],
  internal: Internal,
  canHasRef: boolean,
) {
  for (const path of paths) {
    if (path.isSpreadElement()) {
      meshExpression(path.get("argument"), internal, canHasRef);
    } else {
      /* istanbul ignore else */
      if (path.isExpression()) {
        meshExpression(path, internal, canHasRef);
      }
    }
  }
}

export function meshLValue(
  path: NodePath<types.LVal | types.Expression | types.VoidPattern | null | undefined>,
  internal: Internal,
) {
  /* istanbul ignore else */
  if (path.isExpression() || path.isIdentifier()) {
    meshExpression(path, internal, false);
  }
}

export function meshOrIgnoreExpression<T extends types.Node>(
  path: NodePath<types.Expression | types.VoidPattern | null | undefined | T>,
  internal: Internal,
  canHasRef: boolean,
) {
  /* istanbul ignore else */
  if (path.isExpression()) {
    meshExpression(path, internal, canHasRef);
  }
}

function throwOnAutoUnwrap(path: NodePath<types.Node | null | undefined>, internal: Internal) {
  if (internal.autoUnwrapThrows) {
    err(
      Errors.RulesOfVasille,
      path,
      ["The reactivity breaks here, unwrap intentionally the reactive value, or use non reactive one"].join(" "),
      internal,
    );
  }
}

export function meshExpression(
  nodePath: NodePath<types.Expression | null | undefined>,
  internal: Internal,
  canHasRef: boolean,
) {
  const expr = nodePath.node;

  if (!expr) {
    return;
  }

  switch (expr.type) {
    case "TemplateLiteral": {
      const path = nodePath as NodePath<types.TemplateLiteral>;

      meshOrIgnoreAllExpressions<types.TSType>(path.get("expressions"), internal, false);
      break;
    }
    case "TaggedTemplateExpression": {
      const path = nodePath as NodePath<types.TaggedTemplateExpression>;

      meshExpression(path.get("quasi"), internal, canHasRef);
      break;
    }
    case "Identifier": {
      if (idIsIValue(nodePath as NodePath<types.Identifier>) && !nodeIsMeshed(nodePath)) {
        throwOnAutoUnwrap(nodePath, internal);
        nodePath.replaceWith(t.memberExpression(expr, V));
      }
      break;
    }
    case "ArrayExpression": {
      const path = nodePath as NodePath<types.ArrayExpression>;

      meshAllUnknown(path.get("elements"), internal, true);
      break;
    }
    case "CallExpression":
    case "OptionalCallExpression": {
      const path = nodePath;
      const argPath = path.get("arguments")[0];
      let called: FnNames | null;

      // calls page function
      if (!internal.isComposing && calls(nodePath, ["page"], internal)) {
        const firstArg = nodePath.node.typeParameters?.params[0];
        const string = t.isTSLiteralType(firstArg) && t.isStringLiteral(firstArg.literal) && firstArg.literal.value;

        if (string && !internal.filename.replace(/\.[tj]sx?$/, "").endsWith(string)) {
          err(
            Errors.RulesOfVasille,
            nodePath.get("typeParameters"),
            "Page path does not match the file path",
            internal,
          );
        }
        meshComposeCall(null, nodePath, "page", internal);
      }
      // calls any of compose functions
      else if (!internal.isComposing && (called = calledFn(nodePath, composeFunctions, internal))) {
        meshComposeCall(null, nodePath, called, internal);
      }
      // raw/unwrap call
      else if (calls(path, unwrapFunctions, internal)) {
        if (argPath && argPath.isExpression()) {
          const throws = internal.autoUnwrapThrows;

          internal.autoUnwrapThrows = false;
          meshExpression(argPath, internal, canHasRef);
          path.replaceWith(argPath);
          internal.autoUnwrapThrows = throws;
        } else {
          err(Errors.IncorrectArguments, argPath ?? path, "Failed to unwrap value", internal);
        }
      }
      // arrayModel/setModel/mapModel call
      else if (!internal.isComposing && calls(path, modelFunctions, internal)) {
        /* istanbul ignore else */
        if (argPath) {
          meshAllUnknown([argPath], internal, true);
        }

        const loc = path.node.loc;

        if (calls(path, ["arrayModel"], internal)) {
          path.replaceWith(internal.arrayModel(argPath?.node, path.node, undefined));
        } else if (calls(path, ["mapModel"], internal)) {
          path.replaceWith(internal.mapModel(argPath?.node, path.node, undefined));
        } else {
          /* istanbul ignore else */
          if (calls(path, ["setModel"], internal)) {
            path.replaceWith(internal.setModel(argPath?.node, path.node, undefined));
          }
        }

        path.node.loc = loc;
      }
      // router call
      else if (internal.isComposing && calls(path, ["router"], internal)) {
        if (!internal.stateOnly) {
          routerReplace(path, internal);
        } else {
          err(Errors.IncompatibleContext, path, "The router is not available in stores", internal);
        }
      }
      // abortSignal
      else if (internal.isComposing && calls(path, ["abortSignal"], internal)) {
        meshAllUnknown(path.get("arguments"), internal, false);
        path.node.arguments.unshift(ctx);
      }
      // creteModel
      else if (calls(path, ["createModel"], internal)) {
        meshAllUnknown(path.get("arguments"), internal, true);
        path.node.arguments.unshift(ctx);
        if (internal.devLayer) {
          path.node.arguments.push(nodeToStaticPosition(path.node));
        }
      }
      // showPrompt
      else if (internal.isComposing && !internal.stateOnly && calls(path, ["showPrompt"], internal)) {
        meshAllUnknown(path.get("arguments"), internal, true);
        path.node.arguments.unshift(ctx);
        if (internal.devLayer) {
          /* istanbul ignore else */
          if (path.node.arguments.length < 4) {
            path.node.arguments.push(t.numericLiteral(0));
          }
          path.node.arguments.push(nodeToStaticPosition(path.node));
        }
      }
      // calls safeInit
      else if (calls(path, ["safeInit"], internal)) {
        const arg = path.get("arguments")[0];

        if (path.node.arguments.length !== 1 || !arg.isExpression()) {
          err(Errors.IncorrectArguments, path, "safeInit takes only one argument", internal);
        } else {
          meshExpression(arg, internal, canHasRef);
          arg.replaceWith(t.arrowFunctionExpression([], arg.node));
        }
      }
      // call any other functions invalid if code calls a hint
      else {
        const hint = calledFn(path, hintFunctions, internal);

        if (hint) {
          err(Errors.IncompatibleContext, path, `Usage of hint "${hint}" is restricted here`, internal);
        }

        meshOrIgnoreExpression<types.V8IntrinsicIdentifier>(path.get("callee"), internal, true);
        meshAllUnknown(path.get("arguments"), internal, true);
      }

      break;
    }
    case "AssignmentExpression": {
      const path = nodePath as NodePath<types.AssignmentExpression>;
      const left = path.get("left");
      const right = path.get("right");

      if (left.isMemberExpression() && hasBreakPoint(left, internal) && !pathIsReactiveValue(left)) {
        err(Errors.RulesOfVasille, left, "This assignment breaks the reactivity", internal);
      }

      if (left.isMemberExpression() && !exprIsSure(left, internal)) {
        const property = left.node.property;
        let iterator: NodePath<unknown> = path;
        let inConstructor = false,
          inFunction = false;

        while (iterator && !inConstructor && !inFunction) {
          inConstructor =
            iterator.isClassMethod() && t.isIdentifier(iterator.node.key) && iterator.node.key.name === "constructor";
          inFunction = iterator.isFunction();
          iterator = iterator.parentPath;
        }

        if (!(
          inConstructor &&
          t.isIdentifier(property) &&
          property.name[0] === "$" &&
          t.isThisExpression(left.node.object) &&
          ((right.isIdentifier() && idIsIValue(right)) || (right.isMemberExpression() && memberIsIValue(right.node)))
        )) {
          meshAssigment(path, left, right, property, internal);
        }
      } else if (internal.devLayer && pathIsReactiveValue(left)) {
        meshExpression(right, internal, canHasRef);
        path.replaceWith(internal.updateIValue(path.node, left.node, right.node));
      } else {
        meshLValue(left, internal);
        meshExpression(right, internal, canHasRef);
      }
      break;
    }
    case "MemberExpression":
    case "OptionalMemberExpression": {
      const path = nodePath as NodePath<types.MemberExpression | types.OptionalMemberExpression>;
      const node = path.node;
      const property = path.node.property;
      const propertyPath = path.get("property");
      const object = path.get("object");

      if (object.isIdentifier() && internal.stack.get(object.node.name) === VariablesStatus.StyleSheet) {
        internal.usedStylesProps.add(!node.computed && t.isIdentifier(property) ? property.name : "*");
      }
      meshExpression(object, internal, canHasRef);
      if (t.isExpression(property) && (!propertyPath.isIdentifier() || (node.computed && idIsIValue(propertyPath)))) {
        meshOrIgnoreExpression<types.PrivateName>(propertyPath, internal, true);
      }

      if (memberIsIValue(node)) {
        /* istanbul ignore else */
        if (!nodeIsMeshed(path)) {
          throwOnAutoUnwrap(path, internal);
          if (exprIsSure(path, internal)) {
            path.replaceWith(t.memberExpression(path.node, V));
          } else {
            path.replaceWith(t.optionalMemberExpression(path.node, V, false, true));
          }
        }
      }

      break;
    }
    case "BinaryExpression": {
      const path = nodePath as NodePath<types.BinaryExpression>;

      meshOrIgnoreExpression<types.PrivateName>(path.get("left"), internal, true);
      meshExpression(path.get("right"), internal, canHasRef);
      break;
    }
    case "ConditionalExpression": {
      const path = nodePath as NodePath<types.ConditionalExpression>;

      meshExpression(path.get("test"), internal, canHasRef);
      meshExpression(path.get("consequent"), internal, canHasRef);
      meshExpression(path.get("alternate"), internal, canHasRef);
      break;
    }
    case "LogicalExpression": {
      const path = nodePath as NodePath<types.LogicalExpression>;

      meshExpression(path.get("left"), internal, canHasRef);
      meshExpression(path.get("right"), internal, canHasRef);
      break;
    }
    case "NewExpression": {
      const path = nodePath as NodePath<types.NewExpression>;

      meshOrIgnoreExpression<types.V8IntrinsicIdentifier>(path.get("callee"), internal, true);
      meshAllUnknown(path.get("arguments"), internal, true);
      break;
    }
    case "SequenceExpression": {
      const path = nodePath as NodePath<types.SequenceExpression>;

      meshAllExpressions(path.get("expressions"), internal, true);
      break;
    }
    case "UnaryExpression": {
      const path = nodePath as NodePath<types.UnaryExpression>;

      meshExpression(path.get("argument"), internal, canHasRef);
      break;
    }
    case "UpdateExpression": {
      const path = nodePath as NodePath<types.UpdateExpression>;

      meshExpression(path.get("argument"), internal, canHasRef);
      break;
    }
    case "YieldExpression": {
      const path = nodePath as NodePath<types.YieldExpression>;

      meshExpression(path.get("argument"), internal, canHasRef);
      break;
    }
    case "AwaitExpression": {
      const path = nodePath as NodePath<types.AwaitExpression>;

      meshExpression(path.get("argument"), internal, canHasRef);
      break;
    }
    case "TSInstantiationExpression": {
      const path = nodePath as NodePath<types.TSInstantiationExpression>;

      meshExpression(path.get("expression"), internal, canHasRef);
      break;
    }
    case "TSAsExpression": {
      const path = nodePath as NodePath<types.TSAsExpression>;

      path.replaceWith(path.get("expression"));
      meshExpression(path, internal, canHasRef);
      break;
    }
    case "TSSatisfiesExpression": {
      const path = nodePath as NodePath<types.TSSatisfiesExpression>;

      meshExpression(path.get("expression"), internal, canHasRef);
      break;
    }
    case "TSTypeAssertion": {
      const path = nodePath as NodePath<types.TSTypeAssertion>;

      meshExpression(path.get("expression"), internal, canHasRef);
      break;
    }
    case "ObjectExpression": {
      processObjectExpression(nodePath as NodePath<types.ObjectExpression>, internal, canHasRef);
      break;
    }
    case "FunctionExpression": {
      meshFunction(nodePath as NodePath<types.FunctionExpression>, internal);
      break;
    }
    case "ArrowFunctionExpression": {
      meshFunction(nodePath as NodePath<types.ArrowFunctionExpression>, internal);
      break;
    }
    case "ClassExpression": {
      const classPath = nodePath as NodePath<types.ClassExpression>;
      const idPath = classPath.get("id");

      if (idPath.isIdentifier()) {
        checkNonReactiveName(idPath, internal);
      }
      meshClassBody(classPath.get("body"), internal);
      break;
    }
    case "JSXFragment": {
      err(Errors.IncompatibleContext, nodePath, "JSX fragment is not allowed here", internal);
      break;
    }
    case "JSXElement": {
      err(Errors.IncompatibleContext, nodePath, "JSX element is not allowed here", internal);
      break;
    }
  }
}

export function meshStatements(paths: NodePath<types.Statement>[], internal: Internal) {
  for (const path of paths) {
    meshStatement(path, internal);
  }
}

export function ignoreParams(
  path: NodePath<types.LVal | types.VoidPattern | null | undefined>,
  internal: Internal,
  allowReactiveId: false | ("id" | "array")[],
  restrictDestruction: boolean = false,
  restrictRestElement: boolean = false,
) {
  // param with default value
  if (path.isAssignmentPattern()) {
    const left = path.get("left");

    meshExpression(path.get("right"), internal, true);
    ignoreParams(left, internal, false);

    /* istanbul ignore else */
    if (!allowReactiveId && left.isIdentifier()) {
      checkNonReactiveName(left, internal);
    }
  }
  // param is identifier
  else if (path.isIdentifier()) {
    internal.stack.set(path.node.name, {});
    if (!allowReactiveId || !allowReactiveId.includes("id")) {
      checkNonReactiveName(path, internal);
    }
  }
  // param is object destruction
  else if (path.isObjectPattern()) {
    if (restrictDestruction) {
      err(Errors.RulesOfVasille, path, "Move destruction inside the function body", internal);
    }
    ignoreObjectPattern(path, internal);
  }
  // param is array destruction
  else if (path.isArrayPattern()) {
    for (const element of path.get("elements")) {
      /* istanbul ignore else */
      if (element) {
        ignoreParams(element, internal, allowReactiveId && allowReactiveId.includes("array") && ["id", "array"]);
        if ((!allowReactiveId || !allowReactiveId.includes("array")) && element.isIdentifier()) {
          checkNonReactiveName(element, internal);
        }
      }
    }
  }
  // rest element
  else if (path.isRestElement()) {
    if (restrictRestElement) {
      err(Errors.RulesOfVasille, path, "Rest element can not be used in slots of internal components", internal);
    }
    ignoreParams(path.get("argument"), internal, false);
  }
  // something else
  else {
    meshLValue(path, internal);
  }
}

function ignoreObjectPattern(pattern: NodePath<types.ObjectPattern>, internal: Internal) {
  for (const path of pattern.get("properties")) {
    if (path.isObjectProperty()) {
      const property = path.node;
      const originName =
        (t.isStringLiteral(property.key) && property.key.value) ||
        (!property.computed && t.isIdentifier(property.key) && property.key.name);
      const newName =
        (t.isIdentifier(property.value) && property.value.name) ||
        (t.isAssignmentPattern(property.value) && t.isIdentifier(property.value.left) && property.value.left.name);

      if (originName && newName && originName.startsWith("$") !== newName.startsWith("$")) {
        err(
          Errors.RulesOfVasille,
          path.get("value"),
          `Property "${originName}" can not be renamed to "${newName}": ` +
            (originName.startsWith("$") ? `rename it to "$${newName}"` : `rename it to "${newName.substring(1)}"`),
          internal,
        );
      }

      const valuePath = path.get("value");

      if (valuePath.isObjectPattern()) {
        /* istanbul ignore else */
        if (originName && originName.startsWith("$")) {
          err(Errors.RulesOfVasille, path, "You can not destruct a reactive value", internal);
        }

        ignoreObjectPattern(path.get("value") as NodePath<types.ObjectPattern>, internal);
      } else if (valuePath.isAssignmentPattern()) {
        const right = valuePath.get("right");

        ignoreParams(valuePath.get("left"), internal, ["id"]);
        meshExpression(right, internal, false);

        if (
          (t.isIdentifier(property.key) && property.key.name.startsWith("$")) ||
          (t.isStringLiteral(property.key) && property.key.value.startsWith("$"))
        ) {
          right.replaceWith(internal.ref(right.node, property, undefined, false));
        } else {
          /* istanbul ignore else */
          if (property.computed && !t.isStringLiteral(property.key)) {
            err(Errors.RulesOfVasille, valuePath, "Computed property can not be used in destruction", internal);
          }
        }
      } else {
        /* istanbul ignore else */
        if (t.isIdentifier(property.value)) {
          internal.stack.set(property.value.name, {});

          if (property.value.name.startsWith("$")) {
            path
              .get("value")
              .replaceWith(t.assignmentPattern(property.value, internal.ref(null, property, undefined, false)));
          }
        }
      }
    }
    if (path.isRestElement() && t.isIdentifier(path.node.argument)) {
      internal.stack.set(path.node.argument.name, {});
    }
  }
}

export function reactiveArrayPattern(
  path: NodePath<types.LVal | types.OptionalMemberExpression | types.VoidPattern>,
  internal: Internal,
) {
  if (path.isArrayPattern()) {
    path.get("elements").forEach((element, index) => {
      if (index < 2) {
        checkReactiveName(element, internal);
      } else {
        /* istanbul ignore else */
        if (element.isIdentifier()) {
          checkNonReactiveName(element, internal);
          internal.stack.set(element.node.name, {});
        }
      }
    });
  } else {
    err(Errors.TokenNotSupported, path, "Expected array pattern", internal);
  }
}

function meshForEachHeader(path: NodePath<types.ForInStatement | types.ForOfStatement>, internal: Internal) {
  const left = path.node.left;

  meshExpression(path.get("right"), internal, false);
  /* istanbul ignore else */
  if (t.isVariableDeclaration(left) && t.isVariableDeclarator(left.declarations[0])) {
    ignoreParams(path.get("left").get("declarations")[0].get("id"), internal, false);
  }
}

function meshForHeader(path: NodePath<types.ForStatement>, internal: Internal) {
  const node = path.node;

  /* istanbul ignore else */
  if (node.init) {
    const initPath = path.get("init");

    if (initPath.isExpression()) {
      meshExpression(initPath, internal, false);
    } else {
      for (const declarationPath of initPath.get("declarations")) {
        meshExpression(declarationPath.get("init"), internal, false);
        ignoreParams(declarationPath.get("id"), internal, false);
      }
    }
  }

  meshExpression(path.get("test"), internal, false);
  meshExpression(path.get("update"), internal, false);
}

function meshClassBody(path: NodePath<types.ClassBody>, internal: Internal) {
  for (const item of path.get("body")) {
    if (item.isClassMethod() || item.isClassPrivateMethod()) {
      meshFunction(item, internal);
    } else if (item.isClassProperty()) {
      const key = item.get("key");
      const value = item.get("value");

      if (value.isCallExpression() && calls(value, ["ref"], internal)) {
        const refValue = value.node.arguments[0];
        const pos = value.node.loc;

        checkReactiveName(key, internal);
        meshAllUnknown(value.get("arguments"), internal, true);
        value.replaceWith(
          ref(
            t.isExpression(refValue) ? refValue : null,
            internal,
            item.node,
            key.isIdentifier() ? key.node.name : undefined,
            false,
          ),
        );
        value.node.loc = pos;
      } else {
        if (key.isIdentifier() && value.node !== null) {
          checkNonReactiveName(key, internal);
        }
        meshExpression(item.get("value"), internal, true);
      }
    } else {
      /* istanbul ignore else */
      if (item.isClassPrivateProperty()) {
        meshExpression(item.get("value"), internal, true);
      }
    }
  }
}

function procedureProcessObjectExpression(
  path: NodePath<types.ObjectExpression>,
  internal: Internal,
  state: Exclude<VariableState, VariablesStatus>,
  canHasRef: boolean,
): VariableState {
  for (const prop of path.get("properties")) {
    const keyPath = prop.get("key");
    const valuePath = prop.get("value");

    if (prop.isObjectProperty()) {
      const property = prop as NodePath<types.ObjectProperty>;
      const meshValue = (name: string | undefined) => {
        if (valuePath.isObjectExpression()) {
          procedureProcessObjectExpression(valuePath, internal, name ? (state[name] = {}) : {}, false);
        } else {
          /* istanbul ignore else */
          if (valuePath.isExpression()) {
            meshExpression(valuePath, internal, canHasRef);
          }
        }
      };

      // the property name is known in compile time
      if ((!property.node.computed || keyPath.isStringLiteral()) && valuePath.isExpression()) {
        const name = stringify(keyPath.node);
        let isRef = false;

        if (processRefCall(valuePath, property.node, internal)) {
          isRef = true;
          state[name] = 1;
        } else if (pathIsReactiveValue(valuePath)) {
          state[name] = 1;
        } else if (internal.isComposing && !internal.isFunctionParsing && name.startsWith("$")) {
          meshValue(name);
          valuePath.replaceWith(internal.ref(valuePath.node, property.node, undefined, false));
          state[name] = 1;
        }

        if ((isRef || name.startsWith("$")) && !canHasRef) {
          err(Errors.RulesOfVasille, keyPath, "This object can not contain reactive fields", internal);
        }

        if ((state[name] === 1) !== name.startsWith("$")) {
          err(Errors.RulesOfVasille, keyPath, "Reactivity mismatch between field name and value", internal);
        } else {
          if (!state[name]) {
            meshValue(name);
          }
          state[name] = 1;
        }
      } else {
        meshValue(undefined);
        if (property.node.computed && internal.isComposing) {
          err(Errors.RulesOfVasille, prop.get("key"), "Computed property can not be used in object", internal);
        }
      }
    } else if (prop.isObjectMethod()) {
      if (
        (keyPath.isIdentifier() && keyPath.node.name.startsWith("$") && !prop.node.computed) ||
        (keyPath.isStringLiteral() && keyPath.node.value.startsWith("$"))
      ) {
        err(Errors.RulesOfVasille, prop.get("key"), "Method name can not start with $", internal);
      }
      meshStatement(prop.get("body"), internal);
      internal.wrapFunctionBody(prop.node);
    } else {
      /* istanbul ignore else */
      if (prop.isSpreadElement()) {
        const argumentPath = prop.get("argument");

        if (argumentPath.isObjectExpression()) {
          procedureProcessObjectExpression(argumentPath, internal, state, canHasRef);
        } else {
          meshExpression(argumentPath, internal, canHasRef);
        }
      }
    }
  }

  return state;
}

export function processObjectExpression(
  path: NodePath<types.ObjectExpression>,
  internal: Internal,
  canHasRef: boolean,
): VariableState {
  return procedureProcessObjectExpression(path, internal, {}, canHasRef);
}

export function meshStatement(path: NodePath<types.Statement | null | undefined>, internal: Internal) {
  const statement = path.node;

  switch (statement && statement.type) {
    case "BlockStatement":
      internal.stack.push();
      meshStatements((path as NodePath<types.BlockStatement>).get("body"), internal);
      internal.stack.pop();
      break;

    case "DoWhileStatement": {
      const _path = path as NodePath<types.DoWhileStatement>;

      meshExpression(_path.get("test"), internal, true);
      internal.stack.push();
      meshStatement(_path.get("body"), internal);
      internal.stack.pop();
      break;
    }
    case "ExpressionStatement":
      meshExpression((path as NodePath<types.ExpressionStatement>).get("expression"), internal, true);
      break;

    case "ForInStatement": {
      const _path = path as NodePath<types.ForInStatement>;

      internal.stack.push();
      meshForEachHeader(_path, internal);
      meshStatement(_path.get("body"), internal);
      internal.stack.pop();
      break;
    }
    case "ForOfStatement": {
      const _path = path as NodePath<types.ForOfStatement>;

      internal.stack.push();
      meshForEachHeader(_path, internal);
      meshStatement(_path.get("body"), internal);
      internal.stack.pop();
      break;
    }
    case "ForStatement": {
      const _path = path as NodePath<types.ForStatement>;

      internal.stack.push();
      meshForHeader(_path, internal);
      meshStatement(_path.get("body"), internal);
      internal.stack.pop();
      break;
    }
    case "FunctionDeclaration":
      meshFunction(path as NodePath<types.FunctionDeclaration>, internal);
      break;

    case "IfStatement": {
      const _path = path as NodePath<types.IfStatement>;

      meshExpression(_path.get("test"), internal, true);
      internal.stack.push();
      meshStatement(_path.get("consequent"), internal);
      internal.stack.pop();
      internal.stack.push();
      meshStatement(_path.get("alternate"), internal);
      internal.stack.pop();
      break;
    }

    case "LabeledStatement":
      meshStatement((path as NodePath<types.LabeledStatement>).get("body"), internal);
      break;

    case "ReturnStatement":
      meshExpression((path as NodePath<types.ReturnStatement>).get("argument"), internal, true);
      break;

    case "SwitchStatement": {
      const _path = path as NodePath<types.SwitchStatement>;

      meshExpression(_path.get("discriminant"), internal, true);
      internal.stack.push();
      for (const _case of _path.get("cases")) {
        meshExpression(_case.get("test"), internal, true);
        meshStatements(_case.get("consequent"), internal);
      }
      internal.stack.pop();
      break;
    }
    case "ThrowStatement":
      meshExpression((path as NodePath<types.ThrowStatement>).get("argument"), internal, true);
      break;

    case "TryStatement":
      meshStatement((path as NodePath<types.TryStatement>).get("block"), internal);
      /* istanbul ignore else */
      if ((path as NodePath<types.TryStatement>).node.handler) {
        meshStatement(
          ((path as NodePath<types.TryStatement>).get("handler") as NodePath<types.CatchClause>).get("body"),
          internal,
        );
      }
      meshStatement((path as NodePath<types.TryStatement>).get("finalizer"), internal);
      break;

    case "VariableDeclaration": {
      const _path = path as NodePath<types.VariableDeclaration>;

      for (const declaration of _path.get("declarations")) {
        const initPath = declaration.get("init");
        const composeMethod = calledFn(initPath, composeFunctions, internal);
        const id = declaration.node.id;
        const idPath = declaration.get("id");
        const name = t.isIdentifier(id) ? id.name : undefined;

        if (name && composeMethod) {
          const idPath = declaration.get("id");
          const isNotUpperCase = name[0].toUpperCase() !== name[0];
          const isNotLowerCase = name[0].toLowerCase() !== name[0];
          const isExported = t.isExportNamedDeclaration(path.parent);

          function report(error: string) {
            err(Errors.RulesOfVasille, idPath, error, internal);
          }

          if (["compose", "component"].includes(composeMethod)) {
            if (isNotUpperCase) {
              report("The component name must start with a uppercase letter");
            }
            if (isExported && internal.strictFolders && !internal.filename.includes("/components/")) {
              report("Components must be placed in a folder named `components`");
            }
          }
          if (composeMethod === "view") {
            if (isNotUpperCase) {
              report("The view name must start with a uppercase letter");
            }
            if (!name.endsWith("View")) {
              report("The view name must end with `View`");
            }
            if (isExported && internal.strictFolders && !internal.filename.includes("/views/")) {
              report("Views must be placed in a folder named `views`");
            }
          }
          if (composeMethod === "store") {
            if (isNotLowerCase) {
              report("The store name must start with a lowercase letter");
            }
            if (!name.endsWith("Store")) {
              report("The store name must end with `Store`");
            }
            if (isExported && internal.strictFolders && !internal.filename.includes("/stores/")) {
              report("Stores must be placed in a folder named `stores`");
            }
          }
          if (composeMethod === "model") {
            if (isNotLowerCase) {
              report("The model constructor function name must start with a lowercase letter");
            }
            if (!name.endsWith("Model")) {
              report("The model constructor function name must end with `Model`");
            }
            if (isExported && internal.strictFolders && !internal.filename.includes("/models/")) {
              report("Models must be placed in a folder named `models`");
            }
          }
          if (composeMethod === "modal") {
            if (isNotUpperCase) {
              report("The modal component name must start with a uppercase letter");
            }
            if (!name.endsWith("Modal")) {
              report("The modal component name must end with `Modal`");
            }
            if (isExported && internal.strictFolders && !internal.filename.includes("/modals/")) {
              report("Modals must be placed in a folder named `modals`");
            }
          }
          if (composeMethod === "prompt") {
            if (!name.startsWith("prompt")) {
              report("The prompt function name must start with `prompt`");
            }
            if (isExported && internal.strictFolders && !internal.filename.includes("/prompts/")) {
              report("Prompts must be placed in a folder named `prompts`");
            }
          }
          if (composeMethod === "screen") {
            if (!name.endsWith("Screen")) {
              report("The screen name must start with `Screen`");
            }
            if (isExported && internal.strictFolders && !internal.filename.includes("/screens/")) {
              report("Screens must be placed in a folder named `screens`");
            }
          }
          if (composeMethod === "page") {
            report("Use export default instead");
          }
          if (isExported) {
            /* istanbul ignore else */
            if (
              ![".ts", ".tsx", ".js", ".jsx"].some(ext => {
                return internal.filename.endsWith(`${name}${ext}`);
              })
            ) {
              report(`File name is not correct, expected ${name}.ts, ${name}.tsx, ${name}.js or ${name}.jsx`);
            }
          }
          meshComposeCall(name, initPath, composeMethod, internal, isExported);
        }
        // ref call
        else if (calls(initPath, refFunctions, internal)) {
          const refValue = initPath.node.arguments[0];
          const pos = initPath.node.loc;

          meshAllUnknown(initPath.get("arguments"), internal, false);
          checkReactiveName(idPath, internal);
          initPath.replaceWith(
            ref(refValue, internal, declaration.node, undefined, calls(initPath, ["safeState"], internal)),
          );
          initPath.node.loc = pos;
        } else if (t.isIdentifier(id) && initPath.isObjectExpression()) {
          if (_path.node.kind === "const") {
            internal.stack.set(id.name, processObjectExpression(initPath, internal, true));
          } else {
            processObjectExpression(initPath, internal, true);
            internal.stack.set(id.name, {});
          }
        }
        // calls context
        else if (calls(initPath, ["context"], internal)) {
          meshAllUnknown(initPath.get("arguments"), internal, true);
          /* istanbul ignore else */
          if (name && internal.appData) {
            internal.typeIdentifiersMapping.set(name, internal.appData.composeId(internal, name));
          }
        }
        // variable declaration
        else {
          meshExpression(initPath, internal, true);
          ignoreParams(declaration.get("id"), internal, ["id", "array"]);
          idPath.isIdentifier() && checkNonReactiveName(idPath, internal);
        }
      }
      break;
    }
    case "WhileStatement": {
      const _path = path as NodePath<types.WhileStatement>;

      meshExpression(_path.get("test"), internal, true);
      internal.stack.push();
      meshStatement(_path.get("body"), internal);
      internal.stack.pop();
      break;
    }
    // Handle re-exports: export { Foo as Bar } from './module' or export * from './module'
    case "ExportNamedDeclaration": {
      const exportDecl = path.node as types.ExportNamedDeclaration;
      const declarationPath = (path as NodePath<types.ExportNamedDeclaration>).get("declaration");

      if (exportDecl.source && internal.appData) {
        const sourcePath = exportDecl.source.value;
        const resolvedPath = resolveSourceFilePath(sourcePath, internal);

        // Handle named re-exports: export { A, B as C } from './module'
        /* istanbul ignore else */
        if (exportDecl.specifiers.length > 0) {
          for (const specifier of exportDecl.specifiers) {
            /* istanbul ignore else */
            if (t.isExportSpecifier(specifier)) {
              const exportedId = specifier.exported;
              const localId = specifier.local;

              /* istanbul ignore else */
              if (t.isIdentifier(exportedId) && t.isIdentifier(localId)) {
                const externalId = `${resolvedPath}:${exportedId.name}`;

                internal.appData.registerRedirect(localId.name, externalId, internal);
              }
            }
          }
        }
      }

      if (internal.hmr) {
        /* istanbul ignore else */
        if (declarationPath.isVariableDeclaration()) {
          for (const declaration of declarationPath.get("declarations")) {
            const idPath = declaration.get("id");
            const initPath = declaration.get("init");

            /* istanbul ignore else */
            if (idPath.isIdentifier()) {
              internal.hmr.push({
                local: idPath.node,
                exported: idPath.node,
                isDynamic: calls(initPath, dynamicModulesFunctions, internal),
              });
            }
          }
          /* istanbul ignore else */
          if (!declarationPath.node.kind.endsWith("using")) {
            declarationPath.node.kind = "let";
          }
        }
      }
      meshStatement(declarationPath, internal);
      break;
    }
    case "ClassDeclaration": {
      const classPath = path as NodePath<types.ClassDeclaration>;
      const idPath = classPath.get("id");

      /* istanbul ignore else */
      if (idPath.isIdentifier()) {
        checkNonReactiveName(idPath, internal);
        /* istanbul ignore else */
        if (internal.appData) {
          internal.typeIdentifiersMapping.set(idPath.node.name, internal.appData.composeId(internal, idPath.node.name));
        }
      }
      meshClassBody(classPath.get("body"), internal);

      break;
    }

    case "ExportDefaultDeclaration": {
      const declarationPath = (path as NodePath<types.ExportDefaultDeclaration>).get("declaration");

      // export default 23;
      if (declarationPath.isExpression()) {
        meshExpression(declarationPath, internal, true);
      }
      // export default function ..
      else if (declarationPath.isFunctionDeclaration()) {
        meshFunction(declarationPath, internal);
      }
      // export default class ..
      else {
        /* istanbul ignore else */
        if (declarationPath.isClassDeclaration()) {
          meshClassBody(declarationPath.get("body"), internal);
        }
      }
      break;
    }
    case "TSInterfaceDeclaration": {
      const declaration = path.node as types.TSInterfaceDeclaration;

      internal.appData?.registerInterface(
        internal,
        declaration.id.name,
        processInterface(declaration.body.body, internal),
      );
      break;
    }
    case "TSTypeAliasDeclaration": {
      const alias = path.node as types.TSTypeAliasDeclaration;

      if (t.isTSTypeLiteral(alias.typeAnnotation)) {
        internal.appData?.registerInterface(
          internal,
          alias.id.name,
          processInterface(alias.typeAnnotation.members, internal),
        );
      }
      break;
    }
  }
}

export function meshFunction(
  path: NodePath<
    | types.ArrowFunctionExpression
    | types.FunctionExpression
    | types.FunctionDeclaration
    | types.ObjectMethod
    | types.ClassMethod
    | types.ClassPrivateMethod
  >,
  internal: Internal,
) {
  const throws = internal.autoUnwrapThrows;

  if (path.isFunctionDeclaration() && path.node.id) {
    const idPath = path.get("id");

    /* istanbul ignore else */
    if (idPath.isIdentifier()) {
      internal.stack.set(path.node.id.name, {});
      checkNonReactiveName(idPath, internal);
      if (internal.devLayer) {
        path.insertAfter(internal.setupPosition(idPath.node, path.node));
      }
    }
  }

  internal.stack.push();
  internal.autoUnwrapThrows = false;

  if (path.isFunctionExpression() && path.node.id) {
    internal.stack.set(path.node.id.name, {});
  }

  for (const param of path.get("params")) {
    ignoreParams(param, internal, false);
  }

  const bodyPath = path.get("body");

  if (bodyPath.isExpression()) {
    meshExpression(bodyPath, internal, true);
  } else {
    /* istanbul ignore else */
    if (bodyPath.isBlockStatement()) {
      meshStatement(bodyPath, internal);
    }
  }

  if (path.isFunctionExpression() || path.isArrowFunctionExpression()) {
    path.replaceWith(internal.wrapFunction(path.node));
  } else {
    internal.wrapFunctionBody(
      path.node as types.FunctionDeclaration | types.ObjectMethod | types.ClassMethod | types.ClassPrivateMethod,
    );
  }

  internal.stack.pop();
  internal.autoUnwrapThrows = throws;
}

export function composeExpression(path: NodePath<types.Expression | null | undefined>, internal: Internal) {
  const expr = path.node;

  switch (expr && expr.type) {
    case "CallExpression":
    case "OptionalCallExpression": {
      if (calls(path, ["watch"], internal)) {
        parseCalculateCall(path, internal, path.node, undefined);

        const args = (path.node as types.CallExpression).arguments;

        /* istanbul ignore else */
        if (args) {
          if ((args[2] as types.ArrayExpression).elements.length <= 0) {
            path.replaceWith(t.callExpression(args[1] as types.Expression, []));
          }
        }
      } else if (calls(path, ["beforeMount", "afterMount"], internal)) {
        const arg = path.get("arguments")[0];

        if (arg && (arg.isFunctionExpression() || arg.isArrowFunctionExpression())) {
          meshFunction(arg, internal);
          path.replaceWith(t.callExpression(internal.safe(arg.node), []));
        } else {
          err(Errors.IncorrectArguments, path, "Incorrect hint argument", internal);
        }
      } else if (calls(path, ["beforeDestroy"], internal)) {
        if (internal.stateOnly) {
          err(Errors.IncompatibleContext, path, "Stores/Models in Vasille.JS are not destroyable", internal);
        }

        path.get("callee").replaceWith(t.memberExpression(ctx, t.identifier("runOnDestroy")));
      } else {
        /* istanbul ignore else */
        if (calls(path, ["share"], internal) && isDiCall(path, internal)) {
          if (internal.stateOnly) {
            err(Errors.IncompatibleContext, path, "Stores/Models in Vasille.JS cannot share dependencies", internal);
          }
          path.node.arguments.unshift(ctx);
        }
      }
      break;
    }
    case "JSXElement":
    case "JSXFragment":
      if (internal.stateOnly) {
        return err(Errors.IncompatibleContext, path, "JSX is not allowed in states", internal);
      }
      const conditions: ConditionCollection = { cases: null };

      path.replaceWithMultiple([
        ...transformJsx(path as NodePath<types.JSXElement | types.JSXFragment>, conditions, internal),
        ...processConditions(conditions, internal),
      ]);
      break;
    default:
      meshExpression(path, internal, true);
  }
}

export function composeStatements(paths: NodePath<types.Statement | null | undefined>[], internal: Internal) {
  for (const path of paths) {
    composeStatement(path, internal);
  }
}

export function composeStatement(path: NodePath<types.Statement | null | undefined>, internal: Internal) {
  const statement = path.node;

  switch (statement?.type) {
    case "FunctionDeclaration": {
      meshFunction(path as NodePath<types.FunctionDeclaration>, internal);
      break;
    }
    case "BlockStatement": {
      internal.stack.push();
      composeStatements((path as NodePath<types.BlockStatement>).get("body"), internal);
      internal.stack.pop();
      break;
    }
    case "ExpressionStatement": {
      composeExpression((path as NodePath<types.ExpressionStatement>).get("expression"), internal);
      break;
    }

    case "ReturnStatement":
      composeExpression((path as NodePath<types.ReturnStatement>).get("argument"), internal);
      break;

    case "VariableDeclaration": {
      const _path = path as NodePath<types.VariableDeclaration>;
      const kind = _path.node.kind;
      let switchToConst = true;

      for (const declaration of _path.get("declarations")) {
        const idPath = declaration.get("id");
        const initPath = declaration.get("init");
        const id = idPath.node;
        let meshInit = true;
        let meshId = true;

        function idName(target: types.LVal | types.PatternLike | null = id): string {
          let name = "#";

          /* istanbul ignore else */
          if (t.isIdentifier(target)) {
            name = target.name;
          }

          return name;
        }

        function idDoubleName(): { names: [string, string]; nodes: [types.Node | null, types.Node | null] } {
          const pattern = id as types.ArrayPattern;

          return {
            names: [idName(pattern.elements?.[0]), idName(pattern.elements?.[1])],
            nodes: [pattern.elements?.[0], pattern.elements?.[1]],
          };
        }

        // const [x, y] = await(...)
        if (calls(initPath, asyncFunctions, internal)) {
          const callPath = declaration.get("init") as NodePath<types.CallExpression>;

          reactiveArrayPattern(declaration.get("id"), internal);
          meshAllUnknown(callPath.get("arguments"), internal, false);

          /* istanbul ignore else */
          if (internal.devLayer) {
            const { names, nodes } = idDoubleName();

            callPath.node.arguments.push(
              t.arrayExpression([
                t.arrayExpression([nodeToStaticPosition(nodes[0] ?? id), t.stringLiteral(names[0])]),
                t.arrayExpression([nodeToStaticPosition(nodes[1] ?? id), t.stringLiteral(names[1])]),
              ]),
            );
          }
          callPath.node.arguments.push(ctx);
          meshInit = false;

          if (internal.asyncComposing) {
            callPath.replaceWith(t.awaitExpression(callPath.node));
          }
        }
        // const x = share(y, z)
        else if (isDiCall(initPath, internal)) {
          const callPath = declaration.get("init") as NodePath<types.CallExpression>;

          callPath.node.arguments.unshift(ctx);
          meshAllUnknown(callPath.get("arguments"), internal, false);
          meshInit = false;
          if (t.isIdentifier(id)) {
            checkNonReactiveName(declaration.get("id") as NodePath<types.Identifier>, internal);
          }
        }
        // const x = ..
        else if (t.isIdentifier(id)) {
          const idPath = declaration.get("id") as NodePath<types.Identifier>;

          internal.stack.set(id.name, {});

          const init = declaration.node.init;
          const initPath = declaration.get("init");
          const called = calledFn(initPath, hintFunctions, internal);
          const callPath = initPath as NodePath<types.CallExpression>;
          const isFrom = (array: string[]) => {
            return called && array.includes(called);
          };

          // let a = unwrap(0)
          if (isFrom(unwrapFunctions)) {
            declaration.get("init").replaceWith((init as types.CallExpression).arguments[0]);
            _path.node.kind = kind;
            switchToConst = false;
            checkNonReactiveName(idPath, internal);
          }
          // const x = bind(a + b);
          else if (isFrom(bindFunctions)) {
            const isReactive = exprCall(
              callPath,
              callPath.node,
              internal,
              { name: idName(), strong: true },
              declaration.node,
              false,
            );

            meshInit = !isReactive;
            checkReactiveName(idPath, internal);
          }
          // let y = ref(2)
          else if (isFrom(refFunctions) && processRefCall(initPath, declaration.node, internal, idName())) {
            checkReactiveName(idPath, internal);
            meshInit = false;
          }
          // const arr = arrayModel()
          else if ("arrayModel" === called) {
            const name = idName();
            processModelCall(callPath, declaration.node, "Array", kind === "const", internal, name);
            internal.stack.replace(name, VariablesStatus.ArrayModel);
            meshInit = false;
            checkNonReactiveName(idPath, internal);
          }
          // const map = mapModel();
          else if ("mapModel" === called) {
            processModelCall(callPath, declaration.node, "Map", kind === "const", internal, idName());
            meshInit = false;
            checkNonReactiveName(idPath, internal);
          }
          // const set = setModel();
          else if ("setModel" === called) {
            processModelCall(callPath, declaration.node, "Set", kind === "const", internal, idName());
            meshInit = false;
            checkNonReactiveName(idPath, internal);
          }
          // const $x = debounced(y, 1000);
          else if ("debounced" === called) {
            processDebounceRefCall(callPath, declaration.node, idName(), internal);
            checkReactiveName(idPath, internal);
            meshInit = false;
          }
          // const $x = field($y.z);
          else if ("field" === called) {
            initPath.replaceWith(processFieldRefCall(callPath, internal, declaration, idName()));
            checkReactiveName(idPath, internal);
          }
          // const x = { .. }
          else if (initPath.isObjectExpression() && !idPath.node.name.startsWith("$")) {
            internal.stack.replace(idName(), processObjectExpression(initPath, internal, kind === "const"));
            meshInit = false;
          }
          // const x = y[z]
          else if (initPath.isOptionalMemberExpression() || initPath.isMemberExpression()) {
            const path = initPath as NodePath<t.MemberExpression | t.OptionalMemberExpression>;
            const split = kind === "let" && toFieldRef(path, internal, declaration, idName());

            // let $x = $y.z;
            // let $z = $y[$z];
            if (split) {
              initPath.replaceWith(split);
              checkReactiveName(idPath, internal);
              meshInit = false;
            }
            // const $x = $y.z;
            // const $x = y[$z];
            else if (
              kind === "const" &&
              exprCall(path, path.node, internal, { name: idName(), strong: true }, declaration.node, false)
            ) {
              checkReactiveName(idPath, internal);
              meshInit = false;
            }
            // let $x = y.z;
            else {
              meshExpression(path, internal, false);
              meshInit = false;

              if (kind === "let" && t.isIdentifier(id) && id.name.startsWith("$")) {
                path.replaceWith(ref(path.node, internal, declaration.node, idName(), false));
              } else {
                checkNonReactiveName(idPath, internal);
                switchToConst = false;
              }
            }
          }
          // let x = ..
          else if (kind === "let") {
            if (initPath.isObjectExpression()) {
              processObjectExpression(initPath, internal, false);
            } else {
              meshExpression(initPath, internal, true);
            }

            if (idPath.isIdentifier() && idPath.node.name.startsWith("$")) {
              declaration
                .get("init")
                .replaceWith(ref(declaration.node.init, internal, declaration.node, idName(), false));
            } else {
              switchToConst = false;
            }
            meshInit = false;
          }
          // const x = ..
          else {
            if (idPath.node.name.startsWith("$")) {
              checkReactiveName(idPath, internal);
              if (
                !exprCall(
                  initPath,
                  initPath.node,
                  internal,
                  {
                    name: idName(),
                    strong: true,
                  },
                  declaration.node,
                  false,
                )
              ) {
                err(
                  Errors.IncorrectArguments,
                  declaration,
                  "Computed expression has static value. Make it non reactive",
                  internal,
                );
              }
              meshInit = false;
            } else {
              internal.autoUnwrapThrows = true;
              meshExpression(initPath, internal, true);
              internal.autoUnwrapThrows = false;
              meshInit = false;
            }
          }
        }
        // const { x, y } = $z;
        else if (idPath.isObjectPattern() && initPath.isIdentifier() && idIsIValue(initPath)) {
          for (const property of idPath.get("properties")) {
            if (property.isRestElement()) {
              err(Errors.ParserError, property, "Rest element is not allowed in object destructuring", internal);
            } else {
              const item = property.node as types.ObjectProperty;
              const key = item.key;
              const renamed = item.value;

              /* istanbul ignore else */
              if (t.isIdentifier(renamed)) {
                if (!renamed.name.startsWith("$")) {
                  err(
                    Errors.RulesOfVasille,
                    property.get("value"),
                    "Reactive object destruction required renaming of fields. Example const {a: $a} = $obj;",
                    internal,
                  );
                }
                if (
                  (item.computed && (!t.isStringLiteral(key) || !key.value.startsWith("$"))) ||
                  (!item.computed && t.isIdentifier(key) && !key.name.startsWith("$"))
                ) {
                  const newLine = t.variableDeclaration("const", [
                    t.variableDeclarator(
                      renamed,
                      internal.fieldRef(
                        initPath.node,
                        item.computed ? (key as types.Expression) : t.stringLiteral((key as types.Identifier).name),
                        item,
                        stringify(key),
                      ),
                    ),
                  ]);

                  newLine.loc = property.node.loc;
                  path.insertBefore(newLine);
                } else {
                  err(
                    Errors.RulesOfVasille,
                    property,
                    "Reactive field can not be extracted from a reactive object using destruction",
                    internal,
                  );
                }
              }
            }
          }
          meshId = false;
          meshInit = false;
          path.remove();
        }
        if (meshInit) {
          meshExpression(declaration.get("init"), internal, true);
        }
        if (meshId) {
          ignoreParams(declaration.get("id"), internal, ["id", "array"]);
        }
      }
      if (switchToConst && kind === "let") {
        _path.node.kind = "const";
      }
      break;
    }
    default:
      meshStatement(path, internal);
  }
}

export function compose(
  path: NodePath<types.ArrowFunctionExpression | types.FunctionExpression>,
  internal: Internal,
  method: FnNames,
  isInternalSlot: boolean,
  isSlot: boolean,
  skipCheckParams: boolean,
) {
  const throws = internal.autoUnwrapThrows;
  internal.stack.push();
  internal.autoUnwrapThrows = false;

  const node = path.node;
  const params = node.params;
  const body = path.isArrowFunctionExpression() ? path.get("body") : path.get("body");

  if (t.isFunctionExpression(node) && node.id) {
    internal.stack.set(node.id.name, {});
  }

  if (params.length > 1 && !isInternalSlot) {
    err(Errors.IncorrectArguments, path.get("params")[1], "Extra parameters are not allowed", internal);
  }

  if (!skipCheckParams) {
    for (const param of path.get("params")) {
      ignoreParams(param, internal, false, method !== "page", isInternalSlot);
    }
  }

  if (!isSlot) {
    internal.isComposing = true;
  }

  if (body.isExpression()) {
    composeExpression(body, internal);
  } else {
    /* istanbul ignore else */
    if (body.isBlockStatement()) {
      checkOrder(body.get("body"), internal);
      composeStatement(body, internal);
    }
  }

  if (!isSlot) {
    internal.isComposing = false;
  }
  if (internal.asyncComposing) {
    node.async = true;
  }

  internal.stack.pop();
  internal.autoUnwrapThrows = throws;
}

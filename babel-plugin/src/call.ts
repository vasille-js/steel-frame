import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";
import { Internal } from "./internal.js";

export type FnNames =
  | "compose"
  | "view"
  | "component"
  | "store"
  | "model"
  | "screen"
  | "page"
  | "modal"
  | "prompt"
  | "awaited"
  | "calculate"
  | "computed"
  | "forward"
  | "watch"
  | "ref"
  | "bind"
  | "expr"
  | "raw"
  | "unwrap"
  | "arrayModel"
  | "setModel"
  | "mapModel"
  | "beforeMount"
  | "afterMount"
  | "beforeDestroy"
  | "router"
  | "theme"
  | "dark"
  | "light"
  | "mobile"
  | "tablet"
  | "laptop"
  | "prefersDark"
  | "prefersLight"
  | "allDark"
  | "allLight"
  | "styleSheet"
  | "share"
  | "receive"
  | "impute"
  | "fieldRef"
  | "debounceRef"
  | "safeRef"
  | "safeBind"
  | "safeComputed"
  | "abortSignal"
  | "ctx";

export const dynamicModulesFunctions = [
  "compose",
  "view",
  "component",
  "page",
  "modal",
  "prompt",
  "screen",
] as const satisfies FnNames[];

export const composeFunctions = [...dynamicModulesFunctions, "store", "model"] as const satisfies FnNames[];

export const refFunctions = ["ref", "safeRef"] as const satisfies FnNames[];

export const asyncFunctions = ["awaited"] as const satisfies FnNames[];

export const inlineBindFunctions = ["bind", "safeBind"] as const satisfies FnNames[];

export const bindFunctions = [
  ...inlineBindFunctions,
  "watch",
  "calculate",
  "expr",
  "computed",
  "safeComputed",
] as const satisfies FnNames[];

export const modelFunctions = ["arrayModel", "mapModel", "setModel"] as const satisfies FnNames[];

export const composeOnly = [
  "router",
  "beforeMount",
  "afterMount",
  "beforeDestroy",
  "abortSignal",
] as const satisfies FnNames[];
export const styleOnly = [
  "theme",
  "dark",
  "light",
  "mobile",
  "tablet",
  "laptop",
  "prefersDark",
  "prefersLight",
  "allDark",
  "allLight",
  "styleSheet",
] as const satisfies FnNames[];

export const dependencyInjections = ["share", "receive", "impute"] as const satisfies FnNames[];

export const unwrapFunctions = ["unwrap", "raw"] as const satisfies FnNames[];

export const hintFunctions: FnNames[] = [
  ...refFunctions,
  ...asyncFunctions,
  ...composeFunctions,
  ...bindFunctions,
  ...modelFunctions,
  ...composeOnly,
  ...styleOnly,
  ...dependencyInjections,
  ...unwrapFunctions,
  "debounceRef",
  "fieldRef",
];

function checkCall<T extends string>(name: T, internal: Internal): T {
  if (name === "store" || name === "model") {
    internal.stateOnly = true;
  } else if ((composeFunctions as string[]).includes(name)) {
    internal.stateOnly = false;
  }

  return name;
}

export function calls(path: NodePath<types.CallExpression>, names: FnNames[], internal: Internal): boolean;
export function calls(
  path: NodePath<types.Expression | null | undefined>,
  names: FnNames[],
  internal: Internal,
): path is NodePath<types.CallExpression>;
export function calls(
  path: NodePath<types.Expression | null | undefined>,
  names: FnNames[],
  internal: Internal,
): path is NodePath<types.CallExpression> {
  return !!calledFn(path, names, internal);
}

export function calledFn<T extends FnNames>(
  path: NodePath<types.Node | null | undefined>,
  names: T[],
  internal: Internal,
): T | null {
  const node = path.node;
  const set = new Set<string>(names);
  const callee = t.isCallExpression(node) ? node.callee : null;

  if (callee) {
    if (t.isIdentifier(callee)) {
      const mapped = internal.mapping.get(callee.name);

      if (mapped && set.has(mapped) && internal.stack.get(callee.name) === undefined) {
        return checkCall(mapped as T, internal);
      }
      return null;
    }

    let propName: string | null = null;

    if (t.isMemberExpression(callee)) {
      if (t.isIdentifier(callee.property)) {
        propName = callee.property.name;
      } else {
        /* istanbul ignore else */
        if (t.isStringLiteral(callee.property)) {
          propName = callee.property.value;
        }
      }
    }

    if (
      propName &&
      set.has(propName) &&
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.object) &&
      callee.object.name === internal.global &&
      internal.stack.get(internal.global) === undefined
    ) {
      return checkCall(propName as T, internal);
    }
  }

  return null;
}

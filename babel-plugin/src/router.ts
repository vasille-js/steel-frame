import { NodePath } from "@babel/core";
import * as t from "@babel/types";
import { Internal, ctx } from "./internal";
import { err, Errors } from "./lib";

const navigateMethods = ["goTo", "load"];

export function routerReplace(path: NodePath<unknown>, internal: Internal) {
  const parentPath = path.parentPath;
  const grandParent = parentPath.parent;

  if (
    (parentPath.isMemberExpression() || parentPath.isOptionalMemberExpression()) &&
    t.isIdentifier(parentPath.node.property) &&
    navigateMethods.includes(parentPath.node.property.name) &&
    (t.isCallExpression(grandParent) || t.isOptionalCallExpression(grandParent)) &&
    t.isExpression(grandParent.arguments[0])
  ) {
    validateRouterPath(parentPath.parentPath.get("arguments")[0] as NodePath<t.Expression>, internal);
  }

  path.replaceWith(t.memberExpression(t.memberExpression(ctx, t.identifier("runner")), t.identifier("router")));
}

function validateUrlPath(routes: string[][] | undefined, path: string) {
  if (path.startsWith("http") || !routes) {
    return true;
  }

  const fragments = path.split("/").filter(item => !!item);

  return routes.some(route => {
    if (route.length !== fragments.length) {
      return false;
    }

    for (let i = 0; i < fragments.length; i++) {
      const routePart = route[i];
      const fragment = fragments[i];

      if (routePart !== "*" && routePart !== fragment) {
        return false;
      }
    }
    return true;
  });
}

export function validateRouterPath(path: NodePath<t.Expression>, internal: Internal): void {
  const node = path.node;
  let extractedRoute: string;

  if (t.isStringLiteral(node)) {
    extractedRoute = node.value;
  } else if (t.isTemplateLiteral(node)) {
    extractedRoute = node.quasis.map(item => item.value.cooked).join("*");
  } else {
    return;
  }

  if (!validateUrlPath(internal.routes, extractedRoute.replace(/\*\*+/g, "*"))) {
    err(
      Errors.IncorrectArguments,
      path,
      `Invalid router path "${extractedRoute}". Expected a path matching one of the defined routes.`,
      internal,
    );
  }
}

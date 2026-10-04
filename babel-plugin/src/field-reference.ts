import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";
import { err, Errors, exprCall, pathIsReactiveValue } from "./lib";
import { ctx, Internal } from "./internal";
import { idIsIValue, memberIsIValue } from "./expression";
import { nodeToStaticPosition } from "./transformer";
import { meshAllUnknown, meshExpression } from "./mesh";

function unwrapTsConstructions(path: NodePath<types.Expression>): NodePath<types.Expression> {
  return path.isTSAsExpression() || path.isTSSatisfiesExpression()
    ? unwrapTsConstructions(path.get("expression") as NodePath<types.Expression>)
    : path;
}

export function hasBreakPoint(node: NodePath<types.Expression>, internal: Internal, has = false): boolean {
  if (pathIsReactiveValue(node)) {
    if (has) {
      err(Errors.RulesOfVasille, node, "Nested reactivity is not supported", internal);
    }
    has = true;
  }
  if (node.isMemberExpression() || node.isOptionalMemberExpression()) {
    return hasBreakPoint(
      unwrapTsConstructions((node as NodePath<types.MemberExpression>).get("object")),
      internal,
      has,
    );
  }

  return has;
}

export interface BreakpointParts {
  obj?: NodePath<types.MemberExpression | types.OptionalMemberExpression | types.Identifier>;
  props: (NodePath<types.Expression> | string)[];
}

export function splitByBreakPoint(
  path: NodePath<types.Expression>,
  internal: Internal,
  data: BreakpointParts = { props: [] },
): BreakpointParts {
  if (pathIsReactiveValue(path)) {
    if (data.obj) {
      err(Errors.RulesOfVasille, path, "Nested breakpoints are not allowed", internal);
    }
    data.obj = path;
  }
  if (path.isMemberExpression() || path.isOptionalMemberExpression()) {
    const object = (path as NodePath<types.MemberExpression>).get("object");
    const property = (path as NodePath<types.MemberExpression>).get("property");

    if (property.isPrivateName()) {
      return data;
    }

    if (!data.obj) {
      if (!path.node.computed && property.isIdentifier()) {
        data.props.unshift(property.node.name);
      } else {
        data.props.unshift(property as NodePath<types.Expression>);
      }
    }

    return splitByBreakPoint(object, internal, data);
  }

  return data;
}

export function toFieldRef(
  refValue: NodePath<types.MemberExpression | types.OptionalMemberExpression>,
  internal: Internal,
  area: NodePath<types.Node>,
  name?: string,
): types.Expression | null {
  const split = splitByBreakPoint(refValue, internal);
  const props = split.props.map(item => (typeof item === "string" ? t.stringLiteral(item) : item.node));

  if (split.obj && split.props.length > 0) {
    meshAllUnknown(
      split.props
        .filter(item => typeof item !== "string")
        .filter(item => !pathIsReactiveValue(item))
        .filter(item => !exprCall(item, item.node, internal, {}, item.node, false)),
      internal,
    );

    if (props.length === 1) {
      return internal.fieldRef(split.obj.node, props[0], area.node, name);
    } else {
      return internal.deepFieldRef(split.obj.node, props, area.node, name);
    }
  }

  return null;
}

export function processFieldRefCall(
  call: NodePath<types.CallExpression>,
  internal: Internal,
  area: NodePath<types.Node>,
  name?: string,
): types.Expression {
  const refValue = call.get("arguments")[0];

  if (refValue && (refValue.isMemberExpression() || refValue.isOptionalMemberExpression())) {
    const callNode = toFieldRef(refValue, internal, area, name);

    if (callNode) {
      return callNode;
    }

    return err(Errors.IncorrectArguments, refValue, "Failed to break value into fields", internal, t.nullLiteral());
  }

  return err(
    Errors.RulesOfVasille,
    area,
    "fieldRef function must have one argument, which is a member expression",
    internal,
    t.nullLiteral(),
  );
}

export function processDebounceRefCall(
  path: NodePath<types.CallExpression>,
  area: types.Node,
  name: string | undefined,
  internal: Internal,
) {
  const args = path.get("arguments");
  if (args.length === 2 && pathIsReactiveValue(args[0])) {
    meshAllUnknown([args[1]], internal);
    if (args[0].isMemberExpression()) {
      meshExpression(args[0].get("object"), internal);
    }
    path.node.arguments.unshift(ctx);

    if (internal.devLayer) {
      path.node.arguments.push(nodeToStaticPosition(area));
      /* istanbul ignore else */
      if (name) {
        path.node.arguments.push(t.stringLiteral(name));
      }
    }
  } else {
    err(
      Errors.IncorrectArguments,
      args[0],
      "debounceRef() expects 2 arguments: a reactive value and a delay duration",
      internal,
    );
  }
}

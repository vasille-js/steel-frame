import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";
import { err, Errors, exprCall, pathIsReactiveValue } from "./lib";
import { ctx, Internal } from "./internal";
import { idIsIValue, memberIsIValue } from "./expression";
import { nodeToStaticPosition } from "./transformer";
import { meshAllUnknown } from "./mesh";

function unwrapTsConstructions(path: NodePath<types.Expression>): NodePath<types.Expression> {
  return path.isTSAsExpression() || path.isTSSatisfiesExpression()
    ? unwrapTsConstructions(path.get("expression") as NodePath<types.Expression>)
    : path;
}

export function hasBreakPoint(
  node: NodePath<types.MemberExpression | types.OptionalMemberExpression>,
  internal: Internal,
  has = false,
): boolean {
  const obj = unwrapTsConstructions(node.get("object"));

  if (obj.isMemberExpression() || obj.isOptionalMemberExpression()) {
    if (memberIsIValue(obj.node)) {
      if (has) {
        err(Errors.RulesOfVasille, node, "Nested reactivity is not supported", internal);
      }
      has = true;
    }

    return hasBreakPoint(obj, internal, has);
  } else if (obj.isIdentifier() && idIsIValue(obj) && has) {
    err(Errors.RulesOfVasille, obj, "Nested reactivity is not supported", internal);
  }

  return has;
}

export interface BreakpointParts {
  obj?: NodePath<types.MemberExpression | types.OptionalMemberExpression | types.Identifier>;
  props: (NodePath<types.Expression> | string)[];
}

export function splitByBreakPoint(
  path: NodePath<types.MemberExpression | types.OptionalMemberExpression>,
  internal: Internal,
): BreakpointParts {
  const data: BreakpointParts = { props: [] };
  const property = path.get("property");

  if (!path.node.computed && property.isIdentifier()) {
    data.props.unshift(property.node.name);
  } else {
    data.props.unshift(property as NodePath<types.Expression>);
  }

  return collectBrickPointData(path, internal, data);
}

export function collectBrickPointData(
  node: NodePath<types.MemberExpression | types.OptionalMemberExpression>,
  internal: Internal,
  data: BreakpointParts,
): BreakpointParts {
  const obj = node.get("object");

  if (obj.isMemberExpression() || obj.isOptionalMemberExpression()) {
    const property = (obj as NodePath<types.MemberExpression>).get("property");

    if (property.isPrivateName()) {
      return data;
    }

    if (!data.obj) {
      if (!obj.node.computed && property.isIdentifier()) {
        data.props.unshift(property.node.name);
      } else {
        data.props.unshift(property as NodePath<types.Expression>);
      }
    }

    if (memberIsIValue(obj.node)) {
      if (data.obj) {
        err(Errors.RulesOfVasille, node, "Break point", internal);
      }
      data.obj = obj;
    } else {
      return collectBrickPointData(obj, internal, data);
    }
  }
  if (obj.isIdentifier() && idIsIValue(obj)) {
    data.obj = obj;
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

  if (split.obj) {
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
    } else {
      err(Errors.IncorrectArguments, refValue, "Failed to break value into fields", internal);
    }
  } else {
    err(
      Errors.RulesOfVasille,
      area,
      "fieldRef function must have one argument, which is a member expression",
      internal,
    );
  }

  return t.nullLiteral();
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
    path.node.arguments.unshift(ctx);

    if (internal.devLayer) {
      path.node.arguments.push(nodeToStaticPosition(area));
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

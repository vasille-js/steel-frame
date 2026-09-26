import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";

export function bodyHasJsx(path: NodePath<types.BlockStatement | types.Expression>): boolean {
  return path.find(path => path.isJSX()) !== null;
}

import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";

export function bodyHasJsx(path: NodePath<types.BlockStatement | types.Expression>): boolean {
  let has = false;

  path.traverse({
    JSX() {
      has = true;
    },
  });

  return has;
}

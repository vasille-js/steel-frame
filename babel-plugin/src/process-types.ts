import { types } from "@babel/core";
import * as t from "@babel/types";
import { InterfaceData, Internal } from "./internal";
import { stringify } from "./utils";

const any = 0;
const string = 1;
const number = 2;
const boolean = 3;
export type PropType = typeof string | typeof number | typeof boolean | typeof any;

export function processUnion(type: types.TSUnionType): PropType {
  let isString = false;
  let isNumber = false;
  let isBoolean = false;
  let isAny = false;

  for (const keyword of type.types) {
    if (t.isTSStringKeyword(keyword)) {
      isString = true;
    } else if (t.isTSNumberKeyword(keyword)) {
      isNumber = true;
    } else if (t.isTSBooleanKeyword(keyword)) {
      isBoolean = true;
    } else if (!t.isTSNullKeyword(keyword) && !t.isTSUndefinedKeyword(keyword)) {
      isAny = true;
    }
  }

  if (isAny) {
    return any;
  }
  if (isString) {
    return string;
  }
  if (isNumber && !isBoolean) {
    return number;
  }
  if (isBoolean && !isNumber) {
    return boolean;
  }

  return any;
}

export function processType(type: types.TSType): PropType {
  if (t.isTSUnionType(type)) {
    return processUnion(type);
  }
  if (t.isTSStringKeyword(type)) {
    return string;
  }
  if (t.isTSNumberKeyword(type)) {
    return number;
  }
  if (t.isTSBooleanKeyword(type)) {
    return boolean;
  }

  return any;
}

export function processSignatures(members: t.TSTypeElement[]): Record<string, number> {
  const props: Record<string, number> = {};

  for (const member of members) {
    if (t.isTSPropertySignature(member)) {
      const key = stringify(member.key);
      if (!member.computed && key) {
        props[key] = member.typeAnnotation ? processType(member.typeAnnotation.typeAnnotation) : any;
      }
    }
  }

  return props;
}

export function fieldDataToObjectExpression(data: Record<string, number>): t.ObjectExpression {
  const props: t.ObjectProperty[] = [];

  for (const [key, type] of Object.entries(data)) {
    props.push(t.objectProperty(t.stringLiteral(key), t.numericLiteral(type)));
  }

  return t.objectExpression(props);
}

export function processTypeLiteral(literal: types.TSTypeLiteral) {
  return processSignatures(literal.members);
}

export function processReference(id: types.TSTypeReference, internal: Internal): InterfaceData | undefined {
  /* istanbul ignore else */
  if (t.isIdentifier(id.typeName)) {
    const typeId = internal.typeIdentifiersMapping.get(id.typeName.name);

    if (typeId) {
      return internal.appData?.getInterface(typeId);
    }
  }
}

/**
 * Extract optional property names from a list of TSTypeElement members.
 * @return an array of optional property names.
 */
export function processInterface(members: t.TSTypeElement[], internal: Internal): InterfaceData {
  const optionals: string[] = [];

  for (const member of members) {
    if ((t.isTSPropertySignature(member) || t.isTSMethodSignature(member)) && member.optional) {
      const name = stringify(member.key);
      if (name) {
        optionals.push(name);
      }
    }
  }

  return {
    optionalProperties: optionals,
    fields: internal.shadow ? processSignatures(members) : undefined,
  };
}

export function obtainInterfaceData(type: types.TSType, internal: Internal): InterfaceData | undefined {
  if (t.isTSTypeLiteral(type)) {
    return processInterface(type.members, internal);
  }
  if (t.isTSTypeReference(type)) {
    return processReference(type, internal);
  }
}

import { NodePath, types } from "@babel/core";
import * as t from "@babel/types";
import { calledFn, calls, FnNames, styleOnly } from "./call.js";
import { Internal } from "./internal.js";
import { err, Errors } from "./lib";

const pureNumbersProperties = new Set([
  "opacity",
  "flex",
  "flex-grow",
  "flex-shrink",
  "z-index",
  "zoom",
  "tab-size",
  "orphans",
  "widows",
  "order",
  "grid-row-start",
  "grid-row-end",
  "grid-row",
  "grid-column-start",
  "grid-column-end",
  "grid-column",
  "font-weight",
  "aspect-ratio",
]);

function tryProcessProp(
  path: NodePath<types.ObjectProperty | types.ObjectMethod | types.SpreadElement>,
  pseudo: string,
  media: string,
  internal: Internal,
): Rule[] {
  if (path.isObjectMethod()) {
    return err(Errors.TokenNotSupported, path, "Object methods not supported here", internal, []);
  }
  if (path.isSpreadElement()) {
    return err(Errors.TokenNotSupported, path, "Spread element not supported here", internal, []);
  }

  return processProp(path as NodePath<types.ObjectProperty>, pseudo, media, internal);
}

type Rule = {
  defaultMediaRule: number;
  mediaRule: string;
  theme: string;
  pseudo: string;
  rule: string;
};

const mediaDefaults: FnNames[] = ["mobile", "tablet", "laptop", "prefersDark", "prefersLight"];

function processValue(
  name: string,
  path: NodePath<types.Expression>,
  pseudo: string,
  themes: string[],
  media: string,
  mediaDefault: number[],
  allowFallback: boolean,
  internal: Internal,
): Rule[] {
  const called = calledFn(path, styleOnly, internal);
  const initialPath = path;

  // theme
  if (called === "theme") {
    const call = path.node as types.CallExpression;

    if (t.isStringLiteral(call.arguments[0])) {
      path = (path as NodePath<types.CallExpression>).get("arguments")[1] as NodePath<types.Expression>;
      themes.push(`body.${call.arguments[0].value}`);
      allowFallback = false;
    } else {
      return err(
        Errors.TokenNotSupported,
        (path as NodePath<types.CallExpression>).get("arguments")[0],
        "Expected string literal",
        internal,
        [],
      );
    }
  }
  // dark
  else if (called === "dark") {
    path = (path as NodePath<types.CallExpression>).get("arguments")[0] as NodePath<types.Expression>;
    themes.push(`.dark`);
    allowFallback = false;
  }
  // light
  else if (called === "light") {
    path = (path as NodePath<types.CallExpression>).get("arguments")[0] as NodePath<types.Expression>;
    themes.push(`.light`);
    allowFallback = false;
  }
  // allLight
  else if (called === "allLight") {
    path = (path as NodePath<types.CallExpression>).get("arguments")[0] as NodePath<types.Expression>;
    themes.push(".light");
    mediaDefault.push(mediaDefaults.indexOf("prefersLight") + 1);
    allowFallback = false;
  }
  // allDark
  else if (called === "allDark") {
    path = (path as NodePath<types.CallExpression>).get("arguments")[0] as NodePath<types.Expression>;
    themes.push(".dark");
    mediaDefault.push(mediaDefaults.indexOf("prefersDark") + 1);
  }
  // mobile/tablet/laptop/prefersDark/prefersLight
  else if (called && mediaDefaults.includes(called)) {
    const index = mediaDefaults.indexOf(called) + 1;

    path = (path as NodePath<types.CallExpression>).get("arguments")[0] as NodePath<types.Expression>;
    mediaDefault.push(index);
    allowFallback = false;
  }

  if (path !== initialPath) {
    return processValue(name, path, pseudo, themes, media, mediaDefault, allowFallback, internal);
  }

  function composeRules(value: string): Rule[] {
    const themesList = themes.length ? [...new Set(themes)] : [""];
    const mediaList = mediaDefault.length ? [...new Set(mediaDefault)] : [0];

    return mediaList
      .map(index =>
        themesList.map(
          theme =>
            ({
              defaultMediaRule: index,
              mediaRule: media,
              pseudo: pseudo,
              theme: theme,
              rule: `${name}:${value}`,
            }) satisfies Rule,
        ),
      )
      .flat(1);
  }

  if (path.isStringLiteral()) {
    return composeRules(path.node.value);
  }
  if (path.isNumericLiteral()) {
    return composeRules(pureNumbersProperties.has(name) ? `${path.node.value}` : `${path.node.value}px`);
  }
  if (path.isArrayExpression()) {
    if (path.node.elements.every(item => t.isNumericLiteral(item))) {
      return composeRules(path.node.elements.map(item => `${(item as types.NumericLiteral).value}px`).join(" "));
    } else if (allowFallback) {
      return [
        ...(path as NodePath<types.ArrayExpression>)
          .get("elements")
          .map(path => {
            if (path.isExpression()) {
              return processValue(
                name,
                path as NodePath<types.Expression>,
                pseudo,
                themes,
                media,
                mediaDefault,
                false,
                internal,
              );
            } else {
              return err(Errors.TokenNotSupported, path, "Expected expression", internal, []);
            }
          })
          .flat(1),
      ];
    } else {
      err(Errors.TokenNotSupported, path, "Only numbers arrays are supported here", internal);
    }
  }

  return err(Errors.ParserError, path, "Failed o parse value, it is not a string, number or array", internal, []);
}

function processProp(path: NodePath<types.ObjectProperty>, pseudo: string, media: string, internal: Internal): Rule[] {
  let name: string;

  if (t.isIdentifier(path.node.key) && !path.node.computed) {
    name = path.node.key.name;
  } else if (t.isStringLiteral(path.node.key)) {
    name = path.node.key.value;
  } else {
    return err(
      Errors.TokenNotSupported,
      path.get("key"),
      "Incompatible key, expect identifier or string literal",
      internal,
      [],
    );
  }

  const valuePath = path.get("value");

  if (name.startsWith("@")) {
    if (media || pseudo) {
      return err(
        Errors.TokenNotSupported,
        path.get("key"),
        "Media queries allowed only in the root of style",
        internal,
        [],
      );
    }

    if (valuePath.isObjectExpression()) {
      return valuePath
        .get("properties")
        .map(item => {
          return tryProcessProp(item, "", name, internal);
        })
        .flat(1);
    } else {
      err(Errors.TokenNotSupported, path.get("value"), "Expected object expression", internal, []);
    }
  }
  if (name.startsWith(":")) {
    if (pseudo) {
      err(Errors.ParserError, path.get("key"), "Recursive pseudo classes are restricted", internal, []);
    }
    if (valuePath.isObjectExpression()) {
      return valuePath
        .get("properties")
        .map(item => {
          return tryProcessProp(item, name, media, internal);
        })
        .flat(1);
    } else {
      err(Errors.TokenNotSupported, path.get("value"), "Expected object expression", internal, []);
    }
  }

  return processValue(name, path.get("value") as NodePath<types.Expression>, pseudo, [], media, [], true, internal);
}

export function findStyleInNode(path: NodePath<types.Node | null | undefined>, internal: Internal) {
  if (path.isExportNamedDeclaration()) {
    return findStyleInNode(path.get("declaration"), internal);
  }

  if (
    path.isVariableDeclaration() &&
    path.node.declarations.length === 1 &&
    calls(path.get("declarations")[0].get("init"), ["styleSheet"], internal)
  ) {
    const call = path.node.declarations[0].init as types.CallExpression;
    const callPath = path.get("declarations")[0].get("init") as NodePath<types.CallExpression>;
    const objPath = callPath.get("arguments")[0] as NodePath<types.ObjectExpression>;

    if (call.arguments.length !== 1) {
      return err(Errors.IncorrectArguments, callPath, "styleSheet function has 1 parameter", internal, true);
    }
    if (!t.isObjectExpression(call.arguments[0])) {
      return err(Errors.TokenNotSupported, objPath, "Expected object expression", internal, true);
    }

    for (const path of objPath.get("properties")) {
      if (!path.isObjectProperty()) {
        return err(Errors.TokenNotSupported, path, "Expected object property", internal, true);
      }
      const valuePath = path.get("value");

      if (!valuePath.isObjectExpression()) {
        return err(Errors.TokenNotSupported, path, "Expected object expression", internal, true);
      }
      if (!((t.isIdentifier(path.node.key) && !path.node.computed) || t.isStringLiteral(path.node.key))) {
        return err(Errors.TokenNotSupported, path.get("key"), "Expected identifier of string literal", internal, true);
      }

      const unsorted: Rule[] = [];
      const sorted: {
        [defaultMediaRule: number]: {
          [mediaRule: string]: {
            [theme: string]: {
              [pseudo: string]: string[];
            };
          };
        };
      } = {};

      for (const path of valuePath.get("properties")) {
        unsorted.push(...tryProcessProp(path, "", "", internal));
      }
      for (const rule of unsorted) {
        if (!sorted[rule.defaultMediaRule]) {
          sorted[rule.defaultMediaRule] = {};
        }

        const defaultMediaRule = sorted[rule.defaultMediaRule];

        if (!defaultMediaRule[rule.mediaRule]) {
          defaultMediaRule[rule.mediaRule] = {};
        }

        const mediaRule = defaultMediaRule[rule.mediaRule];

        if (!mediaRule[rule.theme]) {
          mediaRule[rule.theme] = {};
        }

        const theme = mediaRule[rule.theme];

        if (!theme[rule.pseudo]) {
          theme[rule.pseudo] = [];
        }

        theme[rule.pseudo].push(rule.rule);
      }

      const expressions: types.Expression[] = [];

      for (const defaultMediaRule in sorted) {
        for (const mediaRule in sorted[defaultMediaRule]) {
          for (const theme in sorted[defaultMediaRule][mediaRule]) {
            for (const pseudo in sorted[defaultMediaRule][mediaRule][theme]) {
              const rulePack = sorted[defaultMediaRule][mediaRule][theme][pseudo].join(";");
              const pseudoPack = pseudo ? `.{}${pseudo}{${rulePack}}` : `.{}{${rulePack}}`;
              const themePack = theme ? `${theme} ${pseudoPack}` : pseudoPack;
              const mediaRulePack = t.stringLiteral(mediaRule ? `${mediaRule}{${themePack}}` : themePack);

              expressions.push(
                defaultMediaRule !== "0"
                  ? t.arrayExpression([t.numericLiteral(parseInt(defaultMediaRule)), mediaRulePack])
                  : mediaRulePack,
              );
            }
          }
        }
      }

      valuePath.replaceWith(t.arrayExpression(expressions));
    }

    return true;
  }

  return false;
}

import * as fs from "fs";
import path from "path";
import * as babel from "@babel/core";
import vasillePlugin, { AppData, Options } from "../src/index.js";

export function runTest(dir: string, name: string, opts: Partial<Options> = {}) {
  const input = fs.readFileSync(path.join(dir, `${name}.ts`), { encoding: "utf8" });
  const result = babel.transformSync(input, {
    plugins: [
      [vasillePlugin, { devLayer: false, strictFolders: false, appData: new AppData(), ...opts }],
      "@babel/plugin-transform-typescript",
    ],
    filename: path.join(dir, `${name}.ts`),
    sourceFileName: `${name}.js`,
  });
  const expected = fs.readFileSync(path.join(dir, `${name}.js`), { encoding: "utf8" });

  expect(result?.code).toBe(expected.replace(/\n$/, ""));
}

export function throwTest(
  dir: string,
  name: string,
  err: string,
  isTsx?: boolean,
  opts: Partial<Options> & { filename?: string; noPrefix?: boolean } = {},
) {
  const appData = new AppData();
  const fileName = path.join(dir, `${opts.noPrefix ? "" : "err-"}${name}.${isTsx ? "tsx" : "ts"}`);
  const input = fs.readFileSync(fileName, { encoding: "utf8" });

  expect(() => {
    babel.transformSync(input, {
      plugins: [
        [vasillePlugin, { strictFolders: false, throwAtFirstError: true, appData, ...opts }],
        ["@babel/plugin-transform-typescript", { isTSX: isTsx }],
      ],
      filename: opts.filename ?? fileName,
    });
    // @ts-ignore
  }).toThrow(new RegExp(`Vasille\\\[\\d+]\{\\w+}: ${RegExp.escape(err)}`));
}

export function runJsxTest(dir: string, name: string, opts: Partial<Options> & { filename?: string } = {}) {
  const input = fs.readFileSync(path.join(dir, `${name}.tsx`), { encoding: "utf8" });
  const result = babel.transformSync(input, {
    plugins: [
      [vasillePlugin, { devLayer: false, strictFolders: false, appData: new AppData(), ...opts }],
      ["@babel/plugin-transform-typescript", { isTSX: true }],
    ],
    filename: opts.filename ?? path.join(dir, `${name}.tsx`),
  });
  const expected = fs.readFileSync(path.join(dir, `${name}.js`), { encoding: "utf8" });

  expect(result?.code).toBe(expected.replace(/\n$/, ""));
}

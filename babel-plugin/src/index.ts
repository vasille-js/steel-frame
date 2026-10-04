import * as Babel from "@babel/core";
import { transformProgram } from "./transformer.js";
import { CompilationErrorReporter } from "./communication";
import { AppData } from "./internal.js";

export { AppData } from "./internal.js";

function isRoutes(routes: unknown): routes is string[][] {
  return (
    routes instanceof Array &&
    routes.every(item => item instanceof Array && item.map(subitem => typeof subitem === "string"))
  );
}

export interface Options {
  devLayer: unknown;
  strictFolders: unknown;
  replaceWeb: unknown;
  headTag: unknown;
  bodyTag: unknown;
  shadow: unknown;
  throwAtFirstError: unknown;
  reporter: unknown;
  hmr: unknown;
  asyncComposing: unknown;
  routes: unknown;
  appData: unknown;
  typeIdentifiersMapping: unknown;
}

export default function (): Babel.PluginObj<{
  file: { opts: { filename: string } };
  opts: Options;
}> {
  return {
    name: "Vasille",
    visitor: {
      Program(path, params) {
        transformProgram(path, params.file.opts.filename, {
          devLayer: params.opts.devLayer === true,
          strictFolders: params.opts.strictFolders !== false,
          replaceWeb: typeof params.opts.replaceWeb === "string" ? params.opts.replaceWeb : undefined,
          headTag: !!params.opts.headTag,
          bodyTag: !!params.opts.bodyTag,
          shadow: !!params.opts.shadow,
          throwAtFirstError: !!params.opts.throwAtFirstError,
          reporter:
            typeof params.opts.reporter === "function" ? (params.opts.reporter as CompilationErrorReporter) : undefined,
          hmr: params.opts.hmr === true,
          asyncComposing: params.opts.asyncComposing === true,
          routes: isRoutes(params.opts.routes) ? params.opts.routes : undefined,
          appData: params.opts.appData instanceof AppData ? params.opts.appData : undefined,
          typeIdentifiersMapping:
            params.opts.typeIdentifiersMapping instanceof Map ? params.opts.typeIdentifiersMapping : undefined,
        });
      },
    },
  };
}

export type { CompilationErrorReporter, CompilationErrorReport, CompilationErrorReports } from "./communication";

import ts from "typescript";
import { resolve } from "path";
import { existsSync } from "fs";

const importList = new Set([
    "ref",
    "safeState",
    "expr",
    "safeLive",
    "setModel",
    "mapModel",
    "arrayModel",
    "ensure",
    "set",
    "Switch",
    "safe",
    "safeInit",
    "toDeepFieldRef",
    "toFieldRef",
    "ArrayModelView",
    "modal",
    "prompt",
    "showPrompt",
    "mount",
    "routerApp",
    "view",
    "component",
    "compose",
    "bind",
    "calculate",
    "watch",
    "effect",
    "Delay",
    "For",
    "Slot",
    "Watch",
    "awaited",
    "store",
    "model",
    "setErrorHandler",
    "match",
    "ArrayView",
    "MapModelView",
    "SetModelView",
    "QueuedRender",
    "debounced",
    "Zombie",
    "abortSignal",
    "screen",
    "page",
    "setMobileMaxWidth",
    "setTabletMaxWidth",
    "setLaptopMaxWidth",
    "context",
    "impute",
    "receive",
    "share",
    "receiveOptional",
    "Prompt",
    "SteelContext",
    "Model",
    "styleSheet",
]);

const devList = new Set([...importList, "executionPosition", "setupPosition", "positionedText", "runFn", "wrapFn"]);

export function checkImports(folder: string, isDev = false) {
    const fName = resolve(`./src/${folder}/index.ts`);
    if (!existsSync(fName)) {
        throw new Error(`The file ${fName} does not exist`);
    }
    const program = ts.createProgram([fName], { allowJs: true });
    const checker = program.getTypeChecker();
    const sourceFile = program.getSourceFile(fName);
    if (!sourceFile) return [];
    const exportSymbol = checker.getSymbolAtLocation(sourceFile?.getChildAt(0));
    // @ts-ignore see: https://stackoverflow.com/questions/62865648/how-should-i-get-common-js-exports-with-the-typescript-compiler-api
    const exps = checker.getExportsAndPropertiesOfModule(exportSymbol || sourceFile.symbol);
    const mapped = new Set<string>(exps.map(e => e.declarations.map(d => d.name.escapedText)).flat());
    const list = isDev ? devList : importList;
    const missing: string[] = [];
    const extra: string[] = [];

    for (const name of mapped) {
        if (!list.has(name)) {
            extra.push(name);
        }
    }
    for (const name of list) {
        if (!mapped.has(name)) {
            missing.push(name);
        }
    }

    if (missing.length > 0) {
        console.log(`Missing imports in ${fName}: "${missing.join('",\n"')}"`);
    }
    if (extra.length > 0) {
        console.log(`Extra imports in ${fName}: "${extra.join('",\n"')}"`);
    }

    expect(missing.length).toBe(0);
    expect(extra.length).toBe(0);
}

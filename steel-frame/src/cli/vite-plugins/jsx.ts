import pluginJsxSyntax from "@babel/plugin-syntax-jsx";
import pluginVasille from "../../babel-plugin/index.js";
import pluginTypescript from "@babel/plugin-transform-typescript";
import babel from "vite-plugin-babel";
import type { CompilationErrorReporter } from "../../babel-plugin/index.js";

export function getVitePlugins(
    target: "vasille-web/dev" | "vasille-web" | "vasille-web/ssg",
    errorsHandler?: CompilationErrorReporter,
) {
    return [
        babel({
            loader: "js",
            filter: /\.[tj]sx?$/,
            include: ["src/**/*", "vasille-app/**/*"],
            exclude: ["node_modules/**/*"],
            babelConfig: {
                presets: [],
                plugins: [
                    pluginJsxSyntax,
                    [
                        pluginVasille,
                        { replaceWeb: target, devLayer: target === "vasille-web/dev", reporter: errorsHandler },
                    ],
                    [pluginTypescript, { isTSX: true }],
                ],
                sourceMaps: "inline",
                configFile: false,
                babelrc: false,
            },
        }),
    ];
}

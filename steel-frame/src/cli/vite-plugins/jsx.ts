// @ts-ignore
import pluginJsxSyntax from "@babel/plugin-syntax-jsx";
import pluginVasille from "../../babel-plugin/index.js";
// @ts-ignore
import pluginTypescript from "@babel/plugin-transform-typescript";
import babel from "vite-plugin-babel";
import type { CompilationErrorReporter } from "../../babel-plugin/index.js";

export function getVitePlugins(
    target: "steel-frame/web-dev" | "steel-frame/web" | "steel-frame/ssg",
    options: {
        errorsHandler?: CompilationErrorReporter;
        v4Naming: boolean;
    },
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
                        {
                            replaceWeb: target,
                            devLayer: target === "steel-frame/web-dev",
                            hmr: target === "steel-frame/web-dev",
                            reporter: options.errorsHandler,
                            v4Naming: options.v4Naming,
                        },
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

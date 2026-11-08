import { defineConfig } from "jest";

export default defineConfig({
    transform: {
        ".*\\/vasille-web\\/ssg\\/.*\\.tsx$": [
            "babel-jest",
            {
                plugins: [
                    "@babel/plugin-syntax-jsx",
                    [
                        "steel-frame/babel-plugin",
                        {
                            devMode: true,
                            strictFolders: false,
                            replaceWeb: "steel-frame/ssg",
                            headTag: true,
                            bodyTag: true,
                            v4Naming: true,
                        },
                    ],
                    ["@babel/plugin-transform-typescript", { isTSX: true, allowDeclareFields: true }],
                ],
            },
        ],
        ".*\\/integration\\/.*\\.tsx?$": [
            "babel-jest",
            {
                plugins: [
                    "@babel/plugin-syntax-jsx",
                    [
                        "steel-frame/babel-plugin",
                        {
                            strictFolders: false,
                            replaceWeb: "steel-frame/web",
                            headTag: true,
                            bodyTag: true,
                            v4Naming: true,
                        },
                    ],
                    ["@babel/plugin-transform-typescript", { isTSX: true, allowDeclareFields: true }],
                ],
            },
        ],
        "\\.tsx?$": ["babel-jest", { plugins: [["@babel/plugin-transform-typescript", { allowDeclareFields: true }]] }],
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    moduleNameMapper: {
        "steel-frame/web": "<rootDir>/src/vasille-web/web/index.ts",
        "steel-frame/ssg": "<rootDir>/src/vasille-web/ssg/index.ts",
        "steel-frame/shadow": "<rootDir>/src/vasille-web/shadow/index.ts",
        "steel-frame/babel-plugin": "<rootDir>/src/babel-plugin/index.ts",
        "steel-frame/core": "<rootDir>/src/vasille/core/index.ts",
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    coveragePathIgnorePatterns: ["/test/"],
});

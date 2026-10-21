/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    transform: {
        "\\.tsx$": [
            "babel-jest",
            {
                plugins: [
                    "@babel/plugin-syntax-jsx",
                    [
                        "steel-frame/babel-plugin",
                        {
                            devMode: true,
                            strictFolders: false,
                            replaceWeb: "vasille-ssg",
                            headTag: true,
                            bodyTag: true,
                            v4Naming: true,
                        },
                    ],
                    ["@babel/plugin-transform-typescript", { isTSX: true }],
                ],
            },
        ],
        "\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    moduleNameMapper: {
        "vasille-ssg": "<rootDir>/src/ssg/index.ts",
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    coveragePathIgnorePatterns: ["/test/"],
};

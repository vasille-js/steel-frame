/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  transform: {
    "\\.(tsx|test\\.ts)$": [
      "babel-jest",
      {
        plugins: [
          "@babel/plugin-syntax-jsx",
          ["steel-frame/babel-plugin", { devMode: true, strictFolders: false, v4Naming: true }],
          ["@babel/plugin-transform-typescript", { isTSX: true }],
        ],
      },
    ],
    "\\.tsx?$": ["ts-jest", { isolatedModules: true, useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  // moduleNameMapper: {
  //   "^vasille$": "<rootDir>/node_modules/vasille/src/index.ts",
  //   "^vasille-web$": "<rootDir>/node_modules/vasille-web/src/web/index.ts",
  //   "^steel-frame$": "<rootDir>/node_modules/steel-frame/src/index.ts",
  //   "^steel-frame/babel-plugin$": "<rootDir>/node_modules/steel-frame/src/babel-plugin/index.ts",
  //   "^(\\.{1,2}/.*)\\.js$": "$1",
  // },
  // coveragePathIgnorePatterns: ["/test/"],
  // collectCoverageFrom: [
  //   "../vasille/src/**/*.{ts,tsx}",
  //   "../vasille-web/src/**/*.{ts,tsx}",
  //   "../steel-frame/src/**/*.{ts,tsx}",
  // ],
  // transformIgnorePatterns: ["node_modules/(?!vasille|vasille-web|steel-frame)"],
  // coverageDirectory: "./coverage/",
};

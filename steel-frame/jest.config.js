import { defineConfig } from "jest";
import { createDefaultEsmPreset } from "ts-jest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const preset = createDefaultEsmPreset({
    compiler: "typescript",
    tsconfig: "./test/tsconfig.json",
});

export default defineConfig({
    ...preset,
    verbose: true,
    transform: {
        "^.+\\.[jt]sx?$": require.resolve("ts-jest"),
    },
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    coverageReporters: ["lcov", "text"],
    coveragePathIgnorePatterns: ["/test/"],
});

import { defineConfig } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const preset = createDefaultEsmPreset({
    compiler: "typescript",
    tsconfig: "./test/tsconfig.json",
});

export default defineConfig({
    ...preset,
    verbose: true,
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    coverageReporters: ["lcov", "text"],
    coveragePathIgnorePatterns: ["/test/"],
});

import { runMarkDownTest, runHybridTest } from "../run-test.js";
import blocks from "./blocks.js";
import css from "./css.js";
import external from "./external.js";
import heading from "./heading.js";
import hybrid from "./hybrid.js";
import lists from "./lists.js";
import stylish from "./stylish.js";
import table from "./table.js";

it("blocks", async function () {
    await runMarkDownTest(blocks, "markdown/blocks");
});

it("css", async function () {
    await runMarkDownTest(css, "markdown/css");
});

it("external", async function () {
    await runMarkDownTest(external, "markdown/external");
});

it("heading", async function () {
    await runMarkDownTest(heading, "markdown/heading");
});

it("hybrid", async function () {
    await runHybridTest(hybrid, "markdown/hybrid");
});

it("lists", async function () {
    await runMarkDownTest(lists, "markdown/lists");
});

it("stylish", async function () {
    await runMarkDownTest(stylish, "markdown/stylish");
});

it("table", async function () {
    await runMarkDownTest(table, "markdown/table");
});

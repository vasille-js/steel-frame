import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ScreenProps } from "../../../src/vasille/index.js";
import { Mode, routerApp } from "../../../src/vasille-web/ssg/router.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runTest(
    screen: (props: ScreenProps<string>) => Promise<void>,
    filename: string,
    ext = "html",
    mode?: Mode,
) {
    const router = routerApp(
        {
            routes: { "/": { screen } },
        },
        mode,
    );

    expect((await router.render())["/index.html"]).toBe(
        await readFile(path.join(__dirname, filename + `.tsx.${ext}`), "utf8"),
    );
}

export async function runMarkDownTest(screen: (props: ScreenProps<string>) => Promise<void>, filename: string) {
    return await runTest(screen, filename, "md", "markdown");
}

export async function runHybridTest(screen: (props: ScreenProps<string>) => Promise<void>, filename: string) {
    return await runTest(screen, filename, "md", "git-doc");
}

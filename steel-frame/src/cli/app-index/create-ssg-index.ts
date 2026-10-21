import { findRoutes } from "./find-routes.js";
import { SsgRouterMode } from "vasille-web/types";

export async function createSsgIndex(routerDir: string, pagesDir: string, mode: SsgRouterMode): Promise<string> {
    const indexJs: string[] = [];
    const { paths } = await findRoutes(routerDir, pagesDir);

    paths.forEach((path, index) => {
        indexJs.push(`import page${index} from "${path.filePath}";`);
    });

    indexJs.push('import { routerApp } from "vasille-web/ssg";');
    indexJs.push("export const router = routerApp({");
    indexJs.push("  routes: {");

    paths.forEach((path, index) => {
        indexJs.push(`    "${path.urlPath}": {screen: page${index}},`);
    });

    indexJs.push("  }", `}, "${mode}");`);

    return indexJs.join("\n");
}

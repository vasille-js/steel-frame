import { page } from "./page.js";
import { setErrorHandler } from "../../../src/vasille/index.js";
import { webRouterApp } from "../../../src/vasille-web/web/router/router.js";

it("empty router", function (done) {
    const window = page();
    const body = window.document.body;
    let counter = 0;

    setErrorHandler(error => {
        expect(`${error}`).toBe("Error: No fallback screen");
        counter++;
    });

    webRouterApp(body, window as unknown as Window, window.location, { routes: {} });

    setTimeout(() => {
        expect(counter).toBe(1);
        done();
    });
});

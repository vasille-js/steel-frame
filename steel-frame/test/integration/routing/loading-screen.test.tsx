import { routerApp, WebRouter } from "steel-frame";
import { page } from "./page.js";
import { rvComponent1, rvComponent2, rvComponent3, x } from "./router.js";

it("loading screen/overlay test", function (done) {
    const body = page.window.document.body;

    const app = routerApp(
        {
            loadingScreen: x.LoadingScreen,
            loadingOverlay: x.LoadingOverlay,
            routes: {
                "/": { screen: x.C1Screen },
                "/page2": { screen: x.C2Screen },
                "/page3": { screen: x.C3Screen },
            },
        },
        body,
    );
    const router = (app.runner as any).router as WebRouter<string>;

    setTimeout(function () {
        expect(body.children.length).toBe(1);
        expect(body.children[0].innerHTML).toBe("loading");
        rvComponent1?.(1);

        setTimeout(function () {
            expect(body.children.length).toBe(1);
            expect(body.children[0].innerHTML).toBe("component 1");
            router.goTo("/page2");

            setTimeout(function () {
                expect(body.children.length).toBe(1);
                expect(body.children[0].innerHTML).toBe("loading");
                rvComponent2?.(2);

                setTimeout(function () {
                    expect(body.children.length).toBe(1);
                    expect(body.children[0].innerHTML).toBe("component 2");
                    router.ajax("/page3");

                    setTimeout(function () {
                        expect(body.children.length).toBe(2);
                        expect(body.children[0].innerHTML).toBe("component 2");
                        expect(body.children[1].innerHTML).toBe("loading overlay");
                        rvComponent3?.(3);

                        setTimeout(function () {
                            expect(body.children.length).toBe(1);
                            expect(body.children[0].innerHTML).toBe("component 3");
                            done();
                        });
                    });
                });
            });
        });
    });
});

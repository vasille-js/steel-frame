import { JSDOM } from "jsdom";

export function page() {
    const page = new JSDOM(`
        <html>
            <head>
            </head>
            <body>
            </body>
        </html>,
        { pretendToBeVisual: true }
    `);

    global.HTMLElement = page.window.HTMLElement;
    global.customElements = page.window.customElements;
    global.document = page.window.document;
    global.CustomEvent = page.window.CustomEvent;
    global.CSSStyleSheet = page.window.CSSStyleSheet;

    return [page.window.document.body, page.window] as const;
}

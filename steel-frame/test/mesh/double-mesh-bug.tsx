import { component } from "steel-frame";

function getHandler(o: { $bodyHeight: number }) {
    return (entries: ResizeObserverEntry[]) => (o.$bodyHeight = entries[0].contentRect.height);
}

const Accordion = component(() => {
    const o = { $bodyHeight: 0 };
    const resizeObserver = new ResizeObserver(getHandler(o));

    <div
        callback={div => {
            resizeObserver.observe(div);
        }}>
        Test div
    </div>;
});

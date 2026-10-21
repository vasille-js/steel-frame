import { compose, page, receive, share } from "steel-frame";

export default page<"flow">(async () => {
    <D>
        <C />
    </D>;
});

const C = compose(() => {
    const x = receive("dependency");
    const y = receive("unexisting");
});

const D = compose<{ slot?(): void }>(props => {
    share("dependency", "1");
});

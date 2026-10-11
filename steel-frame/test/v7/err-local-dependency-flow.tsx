import { compose, page, receive, share } from "steel-frame";

const C = compose(() => {
  const x = receive("dependency");
  const y = receive("unexisting");
});

const D = compose<{ slot?(): void }>(props => {
  share("dependency", "1");
});

export default page<"flow">(async () => {
  <D>
    <C />
  </D>;
});

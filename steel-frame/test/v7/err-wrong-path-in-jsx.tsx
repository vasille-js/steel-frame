import { beforeMount, compose, router } from "steel-frame";

interface Props {
  "checked:path": string;
}

const C = compose<Props>(props => {
  beforeMount(() => {
    router()?.goTo(props["checked:path"]);
  });
});

const D = compose(() => {
  <C checked:path="/correct" />;
  <C checked:path={"/correct"} />;
  <C checked:path={`/correct/${12}`} />;
  <C checked:path="/wrong" />;
});

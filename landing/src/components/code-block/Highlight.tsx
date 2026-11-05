import { component, receive, Slot } from "steel-frame";
import { blueDark, blueLight } from "../../style/text.js";
import { noTransitions } from "../../context/noTransitions.js";

interface Props {
  slot?(): void;
}

export const Highlight = component<Props>((props) => {
  const isDark = receive("dark");
  const noTransition = receive(noTransitions);
  const r_none = noTransition.r_class;

  <span
    style={{ "font-weight": "bold" }}
    class={[isDark ? blueDark : blueLight, r_none]}
  >
    <Slot model={props.slot} />
  </span>;
});

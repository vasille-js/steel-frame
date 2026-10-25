import { component, receive, Slot } from "steel-frame";
import { blueDark, blueLight } from "../../style/text.js";

interface Props {
  slot?(): void;
}

export const Highlight = component<Props>((props) => {
  const isDark = receive("dark");

  <span style={{ "font-weight": "bold" }} class={isDark ? blueDark : blueLight}>
    <Slot model={props.slot} />
  </span>;
});

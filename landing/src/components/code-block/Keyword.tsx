import { component, receive, Slot } from "steel-frame";
import { orangeDark, orangeLight } from "../../style/text.js";

interface Props {
  slot?(): void;
}

export const Keyword = component<Props>((props) => {
  const isDark = receive("dark");

  <span class={isDark ? orangeDark : orangeLight}>
    <Slot model={props.slot} />
  </span>;
});

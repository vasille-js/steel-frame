import { component, receive, Slot } from "steel-frame";
import { orangeDark, orangeLight } from "../../style/text.js";
import { noTransitions } from "../../context/noTransitions.js";

interface Props {
  slot?(): void;
}

export const Keyword = component<Props>((props) => {
  const isDark = receive("dark");
  const noTransition = receive(noTransitions);
  const r_none = noTransition.r_class;

  <span class={[isDark ? orangeDark : orangeLight, r_none]}>
    <Slot model={props.slot} />
  </span>;
});

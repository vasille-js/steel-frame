import { component, Slot } from "steel-frame";
import { blueDark, blueLight } from "../../style/text.js";

interface Props {
  isDark: boolean;
  slot?(): void;
}

export const Highlight = component<Props>(({ isDark, slot }) => {
  <span style={{ "font-weight": "bold" }} class={isDark ? blueDark : blueLight}>
    <Slot model={slot} />
  </span>;
});

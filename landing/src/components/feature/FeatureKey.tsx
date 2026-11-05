import { component, dark, receive, Slot, styleSheet } from "steel-frame";
import { noTransitions } from "../../context/noTransitions.js";

interface Props {
  slot?(): void;
}

export const FeatureKey = component(({ slot }: Props) => {
  const noTransition = receive(noTransitions);
  const r_none = noTransition.r_class;

  <div class={css.row}>
    <div class={[css.circle, r_none]} />
    <div class={[css.text, r_none]}>
      <Slot model={slot} />
    </div>
  </div>;
});

const css = styleSheet({
  row: {
    display: "flex",
    "align-items": "center",
  },
  circle: {
    width: 12,
    height: 12,
    "border-radius": 6,
    "background-color": ["#e10000", dark("#ff946a")],
    transition: "background-color 0.2s ease-in-out",
    "margin-right": 8,
  },
  text: {
    "font-size": 12,
    height: 13,
    "letter-spacing": "-0.24px",
    "text-transform": "uppercase",
    color: ["#191919", dark("#fff")],
    transition: "color 0.2s ease-in-out",
  },
});

import { component, receive, Slot, styleSheet } from "steel-frame";
import { DoubleTitle } from "../DoubleTitle.js";
import { DoubleDataProps } from "../../interfaces/double-data.js";
import { noTransitions } from "../../context/noTransitions.js";

export const FeatureTitle = component(({ slot, content }: DoubleDataProps) => {
  const noTransition = receive(noTransitions);
  const r_none = noTransition.r_class;

  <DoubleTitle
    title={(props) => {
      <h2 class={[...props.classes, css.h2, r_none]}>
        <Slot model={content ?? slot} {...props} />
      </h2>;
    }}
  />;
});

const css = styleSheet({
  h2: {
    margin: [12, 0],
    "text-transform": "uppercase",
    "font-size": 35,
    "font-weight": "500",
    "letter-spacing": "-1.05px",
  },
});

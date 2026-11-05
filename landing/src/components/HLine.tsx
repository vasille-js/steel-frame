import { component, dark, receive, styleSheet } from "steel-frame";
import { noTransitions } from "../context/noTransitions.js";

export const HLine = component(() => {
  const noTransition = receive(noTransitions);
  const r_none = noTransition.r_class;

  <div class={[css.line]}>
    <div class={[css.inner, css.light, r_none]} style={{ left: "50%" }} />
    <div class={[css.inner, css.light, r_none]} style={{ right: "50%" }} />
    <div class={[css.inner, css.dark, r_none]} style={{ left: 0 }} />
    <div class={[css.inner, css.dark, r_none]} style={{ right: 0 }} />
  </div>;
});

const css = styleSheet({
  line: {
    display: "flex",
    height: 1,
    "align-items": "stretch",
    position: "relative",
    "align-self": "stretch",
  },
  inner: {
    position: "absolute",
    top: 0,
    bottom: 0,
    transition: "width 10s ease-in-out",
  },
  light: {
    width: ["50%", dark(0)],
    "background-color": "#B2B2B2",
  },
  dark: {
    width: [0, dark("50%")],
    "background-color": "#4D4D4D",
  },
});

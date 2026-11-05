import {
  component,
  CssStyleInjector,
  dark,
  mobile,
  receive,
  Slot,
  styleSheet,
  tablet,
} from "steel-frame";
import { noTransitions } from "../../../context/noTransitions.js";

export const Row = component<{
  slot?(): void;
  class?: string | CssStyleInjector;
}>((props) => {
  const noTransition = receive(noTransitions);
  const r_none = noTransition.r_class;

  <div class={css.container}>
    <div class={[css.row, props.class ?? "noop", r_none]}>
      <Slot model={props.slot} />
    </div>
  </div>;
});

const css = styleSheet({
  row: {
    display: "flex",
    width: "100%",
    "background-color": [dark("#212121"), "#fdfdfd"],
    "border-radius": 16,
    transition: "background-color 0.2s ease-in-out",
    "box-sizing": "border-box",
    "justify-content": "center",
    margin: [0, "auto"],
    "max-width": [
      1025,
      tablet("calc(100vw - 157px)"),
      mobile("calc(100vw - 20px)"),
    ],
  },
  container: {
    width: "100%",
    padding: [[0, 20], mobile([0, 10])],
    "box-sizing": "border-box",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
});

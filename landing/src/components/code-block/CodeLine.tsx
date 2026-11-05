import { component, dark, receive, share, Slot, styleSheet } from "steel-frame";
import { noTransitions } from "../../context/noTransitions.js";

interface Props {
  number: number;
  slot?(): void;
}

interface DarkProps {
  isDark: boolean;
  slot?(): void;
}

export const CodeLine = component<Props>((props) => {
  const { number, slot } = props;
  const reverse = number % 2 === 0;
  const noTransition = receive(noTransitions);
  const r_none = noTransition.r_class;

  <div class={css.line}>
    <div
      class={[css.inner, css.placeholder, reverse && css.placeholderR, r_none]}
    >
      <div class={css.lineNumber} aria-hidden="true" role="none">
        {number}
      </div>
      <div class={[css.text, reverse ? css.light : css.dark]}>
        <Dark slot={slot} isDark={!reverse} />
      </div>
    </div>
    <div class={[css.inner, css.abs, reverse && css.absR, r_none]}>
      <div class={css.lineNumber} aria-hidden="true" role="none">
        {number}
      </div>
      <div class={[css.text, reverse ? css.dark : css.light]}>
        <Dark slot={slot} isDark={reverse} />
      </div>
    </div>
  </div>;
});

const Dark = component<DarkProps>((props) => {
  share("dark", props.isDark ? "dark" : "");

  <Slot model={props.slot} />;
});

const css = styleSheet({
  line: {
    overflow: "hidden",
    "white-space": "pre-wrap",
    "font-family": "FM, monospace",
    "font-size": 14,
    width: "fit-content",
    position: "relative",
  },
  abs: {
    height: "100%",
    top: [0, dark("100%")],
    position: "absolute",
    transition: "top 2s ease-in-out 0.2s",
  },
  absR: {
    top: ["-100%", dark("0")],
  },
  placeholder: {
    opacity: ["0", dark("1")],
    transition: "opacity 2s ease-in-out 0.2s",
    width: "max-content",
    "padding-right": 10,
  },
  placeholderR: {
    opacity: ["1", dark("0")],
  },
  inner: {
    display: "flex",
  },
  lineNumber: {
    width: 20,
    "text-align": "right",
    color: "#80808080",
    "margin-right": 10,
  },
  text: {
    display: "flex",
  },
  dark: {
    color: "#f2f2f2",
  },
  light: {
    color: "#191919",
  },
});

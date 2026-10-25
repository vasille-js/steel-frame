import { component, dark, share, Slot, styleSheet } from "steel-frame";

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

  <div class={styles.line}>
    <div
      class={[styles.inner, styles.placeholder, reverse && styles.placeholderR]}
    >
      <div class={styles.lineNumber} aria-hidden="true" role="none">
        {number}
      </div>
      <div class={[styles.text, reverse ? styles.light : styles.dark]}>
        <Dark slot={slot} isDark={!reverse} />
      </div>
    </div>
    <div class={[styles.inner, styles.abs, reverse && styles.absR]}>
      <div class={styles.lineNumber} aria-hidden="true" role="none">
        {number}
      </div>
      <div class={[styles.text, reverse ? styles.dark : styles.light]}>
        <Dark slot={slot} isDark={reverse} />
      </div>
    </div>
  </div>;
});

const Dark = component<DarkProps>((props) => {
  share("dark", props.isDark ? "dark" : "");

  <Slot model={props.slot} />;
});

const styles = styleSheet({
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

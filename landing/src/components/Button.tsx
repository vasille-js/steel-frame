import { component, dark, receive, styleSheet } from "steel-frame";
import { noTransitions } from "../context/noTransitions.js";

interface Props {
  text: string;
  primary?: boolean;
  minWidth?: number;
  accessKey?: string;
  action?(): void;
}

export const Button = component(
  ({ primary, text, minWidth, accessKey, action }: Props) => {
    const noTransition = receive(noTransitions);
    const r_none = noTransition.r_class;

    <a
      href={"#"}
      class={[css.btn, primary ? css.primary : css.secondary, r_none]}
      type={"button"}
      style={{ "min-width": minWidth }}
      accesskey={accessKey}
      onclick={
        action
          ? (ev) => {
              ev.preventDefault();
              action();
            }
          : undefined
      }
      onkeydown={(e) => {
        if (e.key === "Enter") {
          action?.();
        }
      }}
    >
      <div class={[css.text, r_none]}>
        <div class={[css.dark, css.item]}>{text}</div>
        <div class={[css.light, css.item]}>{text}</div>
      </div>
    </a>;
  },
);

const css = styleSheet({
  btn: {
    padding: [0, 24],
    height: 47,
    "border-radius": 24,
    border: "none",
    margin: 6,
    overflow: "hidden",
    transition: "background 0.2s ease-in-out",
    "font-family": "inherit",
    "font-weight": 500,
    "text-decoration": "none",
  },
  primary: {
    background: ["#0302DF", dark("#8ba1ff")],
    ":hover": {
      background: ["#0100c8", dark("#a0b3ff")],
    },
  },
  secondary: {
    background: ["#191919", dark("#FFFFFF")],
    ":hover": {
      background: ["#232323", dark("#dedede")],
    },
  },
  text: {
    "font-size": 16,
    display: "flex",
    "flex-direction": "column",
    height: 94,
    position: "relative",
    top: ["-47px", dark(0)],
    transition: "top 0.2s ease-in-out",
    "letter-spacing": "-0.32px",
    "align-items": "center",
  },
  item: {
    height: 47,
    display: "flex",
    "align-items": "center",
  },
  light: {
    color: "#fff",
  },
  dark: {
    color: "#191919",
  },
});

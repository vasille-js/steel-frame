import {
  component,
  CssStyleInjector,
  dark,
  Slot,
  styleSheet,
} from "steel-frame";

interface Props {
  description?(props: {
    classes: (string | CssStyleInjector)[];
    isDark: boolean;
  }): void;
}

export const DoubleDescription = component(({ description }: Props) => {
  <div class={[css.container]}>
    <Slot model={description} classes={[css.dark, css.text]} isDark={true} />
    <Slot model={description} classes={[css.light, css.text]} isDark={false} />
  </div>;
});

const css = styleSheet({
  container: {
    position: "relative",
    width: "fit-content",
    height: "fit-content",
    overflow: "hidden",
  },
  light: {
    position: "absolute",
    top: ["0", dark("-100%")],
    color: "#585858",
    transition: "top 1s ease-in-out 0.2s",
  },
  dark: {
    color: "#a4a4a4",
    opacity: ["0", dark("1")],
    transition: "opacity 1s ease-in-out 0.2s",
  },
  text: {
    "font-size": 15,
    "letter-spacing": "-0.3px",
  },
});

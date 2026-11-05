import {
  component,
  CssStyleInjector,
  dark,
  Slot,
  styleSheet,
} from "steel-frame";

interface Props {
  title?(props: {
    classes: (string | CssStyleInjector)[];
    isDark: boolean;
  }): void;
}

export const DoubleTitle = component(({ title }: Props) => {
  <div class={[css.container]}>
    <Slot model={title} classes={[css.dark]} isDark={true} />
    <Slot model={title} classes={[css.light]} isDark={false} />
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
    top: ["0", dark("100%")],
    color: "#191919",
    transition: "top 1s ease-in-out 0.2s",
  },
  dark: {
    color: "#fff",
    opacity: ["0", dark("1")],
    transition: "opacity 1s ease-in-out 0.2s",
  },
});

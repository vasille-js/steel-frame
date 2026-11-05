import { dark, styleSheet } from "steel-frame";

export const css = styleSheet({
  h1: {
    "font-size": 35,
    "letter-spacing": "-1.05px",
    "line-height": "1.10",
    "text-transform": "uppercase",
    margin: [0, 0, 12],
  },
  description: {
    "font-size": 15,
    "line-height": "120%",
    "letter-spacing": "-0.3px",
    "margin-bottom": 18,
  },
  centerText: {
    "text-align": "center",
  },
  orangeDark: {
    color: [dark("#ff946a"), "#ff5f24"],
    transition: "color 0.2s ease-in-out",
  },
  orangeLight: {
    color: [dark("#ffabab"), "#e10000"],
    transition: "color 0.2s ease-in-out",
  },
  blueDark: {
    color: [dark("#899fff"), "#0330ff"],
    transition: "color 0.2s ease-in-out",
  },
  blueLight: {
    color: [dark("#605fff"), "#0302df"],
    transition: "color 0.2s ease-in-out",
  },
});

export const h1 = css.h1;
export const description = css.description;
export const centerText = css.centerText;
export const orangeDark = css.orangeDark;
export const orangeLight = css.orangeLight;
export const blueDark = css.blueDark;
export const blueLight = css.blueLight;

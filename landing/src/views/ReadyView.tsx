import { dark, receive, styleSheet, view } from "steel-frame";
import { VLine } from "../components/VLine.js";
import { Row } from "../components/code-block/lib/Row.js";
import { DoubleTitle } from "../components/DoubleTitle.js";
import { Button } from "../components/Button.js";
import unknownSvg from "../assets/unknown.svg";
import { noTransitions } from "../context/noTransitions.js";

export const ReadyView = view(() => {
  const noTransition = receive(noTransitions);
  const r_none = noTransition.r_class;

  <VLine height={40} />;
  <Row class={css.container}>
    <DoubleTitle
      title={({ classes, isDark }) => {
        <div
          class={[...classes, css.title, r_none]}
          style={{ color: isDark ? "#F9F9F9" : "#2a2a2a" }}
        >
          Ready to Build Great Applications?
        </div>;
      }}
    ></DoubleTitle>
    <div class={css.row}>
      <Button text={"Get Started"} primary minWidth={113} />
      <Button text={"See live demo"} minWidth={113} />
    </div>
    <div
      class={[css.img, css.img1, r_none]}
      style={{ "mask-image": `url("${unknownSvg}")` }}
    />
    <div
      class={[css.img, css.img2, r_none]}
      style={{ "mask-image": `url("${unknownSvg}")` }}
    />
  </Row>;
  <div style={{ height: 35 }} />;
});

const css = styleSheet({
  container: {
    "flex-direction": "column",
    padding: 95,
    "align-items": "center",
    "justify-content": "center",
    "background-color": [dark("#2A2A2A"), "#F9F9F9"],
    overflow: "hidden",
    position: "relative",
  },
  title: {
    "font-size": 35,
    "letter-spacing": "-1.05px",
    "line-height": "1.10",
    "text-transform": "uppercase",
    margin: [6, 0, 18],
    "max-width": 350,
    "text-align": "center",
  },
  row: {
    display: "flex",
    "flex-wrap": "wrap",
    "justify-content": "center",
  },
  img: {
    position: "absolute",
    width: 316,
    height: 316,
    "background-color": ["#e10000", dark("#ff946a")],
    "mask-size": [316, 316],
    transition: "background-color 0.2s ease-in-out",
    "@media screen and (max-width: 800px)": {
      display: "none",
    },
  },
  img1: {
    left: "-26px",
    bottom: "-39px",
    transform: "rotate(12deg)",
    "@media screen and (max-width: 1200px)": {
      left: "-185px",
    },
  },
  img2: {
    position: "absolute",
    top: "-120px",
    right: "-20px",
    transform: "rotate(-12deg)",
    "@media screen and (max-width: 1200px)": {
      right: "-160px",
    },
  },
});

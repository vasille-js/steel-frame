import { state } from "steel-frame";

export let wr_screenWidth = state(0);

window.addEventListener("resize", () => {
  wr_screenWidth = window.innerWidth;
});

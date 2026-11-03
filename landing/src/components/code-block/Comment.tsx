import { component, receive, Slot } from "steel-frame";

interface Props {
  slot?(): void;
}

export const Comment = component<Props>((props) => {
  const isDark = receive("dark");

  <span style={{ color: isDark ? "#a5a5a5" : "#585858" }}>
    <Slot model={props.slot} />
  </span>;
});

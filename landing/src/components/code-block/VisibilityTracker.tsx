import { component, Slot, beforeDestroy, styleSheet, share } from "steel-frame";
import { noTransitions } from "../../context/noTransitions.js";

interface Props {
  slot?(): void;
}

export const VisibilityTracker = component<Props>(({ slot }) => {
  let $visible = false;
  const r_class = !$visible && css.none;
  let observer: IntersectionObserver = newIntersectionObserver({ $visible });

  share(noTransitions, { r_class });

  <div
    class={css.div}
    callback={(div) => {
      observer.observe(div);
    }}
  >
    <div class={[css.div, css.inner]}>
      <Slot model={slot} />
    </div>
  </div>;

  beforeDestroy(() => {
    observer.disconnect();
  });
});

function newIntersectionObserver({ $visible }: { $visible: boolean }) {
  return new IntersectionObserver((entries) => {
    $visible = entries[0].isIntersecting;
  });
}

const css = styleSheet({
  div: {
    width: "100%",
  },
  inner: {
    "flex-direction": "column",
    "align-items": "center",
    display: "flex",
  },
  none: {
    transition: "none !important",
  },
});

import { component, Slot, beforeDestroy, styleSheet } from "steel-frame";

interface Props {
  slot?(): void;
}

export const VisibilityTracker = component<Props>(({ slot }) => {
  let $visible = true;
  let $height = 0;

  let observer: IntersectionObserver = newIntersectionObserver({ $visible });
  let resizeObserver: ResizeObserver = newResizeObserver({ $height });

  <div
    class={styles.div}
    callback={(div) => {
      observer.observe(div);
    }}
    style={{ "min-height": $height }}
  >
    <div
      class={[styles.div, styles.inner]}
      style={{ display: $visible ? "flex" : "none" }}
      callback={(div) => {
        $height = div.offsetHeight;
        resizeObserver.observe(div);
      }}
    >
      <Slot model={slot} />
    </div>
  </div>;

  beforeDestroy(() => {
    observer.disconnect();
    resizeObserver.disconnect();
  });
});

function newIntersectionObserver({ $visible }: { $visible: boolean }) {
  return new IntersectionObserver((entries) => {
    $visible = entries[0].isIntersecting;
  });
}

function newResizeObserver({ $height }: { $height: number }) {
  return new ResizeObserver((entries) => {
    const height = entries[0].contentRect.height;

    if (height) {
      $height = height;
    }
  });
}

const styles = styleSheet({
  div: {
    width: "100%",
  },
  inner: {
    "flex-direction": "column",
    "align-items": "center",
  },
});

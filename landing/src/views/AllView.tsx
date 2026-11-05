import { mobile, QueuedRender, styleSheet, view } from "steel-frame";
import { VisibilityTracker } from "../components/code-block/VisibilityTracker.js";
import { DescriptionView } from "./DescriptionView.js";
import { GetStartedView } from "./GetStartedView.js";
import { GameChangerView } from "./GameChangerView.js";
import { GreatForView } from "./GreatForView.js";
import { ExperienceView } from "./ExperienceView.js";
import { ReadyView } from "./ReadyView.js";

export const AllView = view(() => {
  <div class={css.content}>
    <VisibilityTracker>
      <DescriptionView />
    </VisibilityTracker>
    <QueuedRender>
      <VisibilityTracker>
        <GetStartedView />
      </VisibilityTracker>
    </QueuedRender>
    <QueuedRender>
      <VisibilityTracker>
        <GameChangerView />
      </VisibilityTracker>
    </QueuedRender>
    <QueuedRender>
      <VisibilityTracker>
        <GreatForView />
      </VisibilityTracker>
    </QueuedRender>
    <QueuedRender>
      <VisibilityTracker>
        <ExperienceView />
      </VisibilityTracker>
    </QueuedRender>
    <QueuedRender>
      <VisibilityTracker>
        <ReadyView />
      </VisibilityTracker>
    </QueuedRender>
  </div>;
});

const css = styleSheet({
  content: {
    flex: "9999",
    // "max-width": 1025,
    "max-width": ["calc(100dvw - 97px)", mobile("100%")],
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
  },
});

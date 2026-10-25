import {
  awaited,
  Else,
  ElseIf,
  If,
  mobile,
  page,
  QueuedRender,
  router,
  styleSheet,
} from "steel-frame";
import { Panel } from "./../components/Panel.js";
import { HeroView } from "../views/HeroView.js";
import { VisibilityTracker } from "../components/code-block/VisibilityTracker.js";
import { Button } from "../components/Button.js";

export default page(async () => {
  const [r_err, r_next] = awaited(() => import("./../views/AllView.js"));
  const r_AllView = r_next?.AllView;

  <div class={styles.page}>
    <VisibilityTracker>
      <HeroView />
    </VisibilityTracker>
    <main role="main" class={styles.bigScreen}>
      <If
        $condition={r_AllView}
        slot={(AllView) => {
          <AllView />;
        }}
      />
      <ElseIf $condition={r_err}>
        <div style={{ "align-self": "center", display: "flex" }}>
          <Button
            text={"Retry"}
            action={() => {
              router()?.reload();
            }}
          />
        </div>
      </ElseIf>
      <Else>
        <div
          style={{
            display: "flex",
            "justify-content": "center",
            width: "100%",
          }}
        >
          <div
            class="loader"
            style={{ margin: [40, 0], "align-self": "center" }}
          ></div>
        </div>
      </Else>
    </main>
    <QueuedRender priority="high">
      <Panel />
    </QueuedRender>
  </div>;
});

const styles = styleSheet({
  page: {
    display: "flex",
    "align-items": "stretch",
    "flex-direction": "column",
    "padding-left": [97, mobile(0)],
  },
  bigScreen: {
    display: "flex",
    "align-items": "stretch",
    "flex-direction": "column",
  },
  bg: {
    flex: "1",
  },
});

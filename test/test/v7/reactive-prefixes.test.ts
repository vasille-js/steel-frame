import { component, effect, live, state } from "steel-frame";
import { testComponent } from "../testComponent";

it("uses new reactive prefixes", function () {
  const [control] = testComponent(
    component(() => {
      let wr_count = state(0);
      const r_live = live(wr_count + 1);
      const stats = { count: 0, live: 0 };

      effect(() => {
        void wr_count;
        stats.count++;
      });
      effect(() => {
        void r_live;
        stats.live++;
      });

      return {
        r_count: wr_count,
        r_live: r_live,
        stats: stats,
        inc() {
          wr_count++;
        },
      };
    }),
  );

  expect(control.r_count).toBe(0);
  expect(control.r_live).toBe(1);
  expect(control.stats).toEqual({ count: 1, live: 1 });

  control.inc();

  expect(control.r_count).toBe(1);
  expect(control.r_live).toBe(2);
  expect(control.stats).toEqual({ count: 2, live: 2 });
});

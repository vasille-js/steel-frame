import { component, safeInit, safeLive, safeState } from "steel-frame";
import { testComponent } from "../testComponent";

function throwNow(): number {
  throw new Error("test");
}

it("trows in safe boundaries", function () {
  const [control] = testComponent(
    component(() => {
      let wr_count = safeState(throwNow());
      let r_live = safeLive((wr_count ?? 0) + throwNow());
      const init = safeInit(throwNow());

      return {
        r_count: wr_count,
        r_live,
        init,
        setCount(count: number) {
          wr_count = count;
        },
      };
    }),
  );

  expect(control.init).toBe(undefined);
  expect(control.r_count).toBe(undefined);
  expect(control.r_live).toBe(undefined);

  control.setCount(1);

  expect(control.r_count).toBe(1);
  expect(control.r_live).toBe(undefined);
});

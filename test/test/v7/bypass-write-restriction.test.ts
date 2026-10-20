import { testComponent } from "../testComponent";
import { bypassWriteRestriction, component, effect } from "steel-frame";

it("bypass write restriction", function () {
  const [control] = testComponent(
    component(() => {
      let wr_value = 0;
      let wr_copy = 0;

      effect(() => {
        bypassWriteRestriction(wr_copy, wr_value);
      });

      return {
        r_value: wr_value,
        r_copy: wr_copy,
        setValue(value: number) {
          wr_value = value;
        },
      };
    }),
  );

  expect(control.r_value).toBe(0);
  expect(control.r_copy).toBe(0);

  control.setValue(1);

  expect(control.r_value).toBe(1);
  expect(control.r_copy).toBe(1);
});

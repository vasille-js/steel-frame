import { testComponent } from "../testComponent";
import { component, debounced } from "steel-frame";

it("debounced", function (done) {
  const [control] = testComponent(
    component(() => {
      let wr_value = 0;
      const r_debounced = debounced(wr_value, 100);

      return {
        r_value: wr_value,
        r_debounced,
        setValue(value: number) {
          wr_value = value;
        },
      };
    }),
  );

  expect(control.r_value).toBe(0);
  expect(control.r_debounced).toBe(0);

  control.setValue(1);
  expect(control.r_value).toBe(1);
  expect(control.r_debounced).toBe(0);

  setTimeout(() => {
    expect(control.r_value).toBe(1);
    expect(control.r_debounced).toBe(1);
    done();
  }, 100);
});

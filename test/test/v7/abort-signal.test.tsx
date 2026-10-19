import { abortSignal, awaited, component } from "steel-frame";
import { testComponent } from "../testComponent";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

it("should abort", done => {
  const [control, body, app] = testComponent(
    component(() => {
      const [r_err, r_data] = awaited(async () => {
        await sleep(10);
        return 1;
      });

      return {
        r_err,
        r_data,
        signal: abortSignal(),
      };
    }),
  );

  expect(control.r_err).toBe(undefined);
  expect(control.r_data).toBe(undefined);
  expect(control.signal?.aborted).toBe(false);

  app.destroy(Infinity);

  expect(control.r_err).toBe(undefined);
  expect(control.r_data).toBe(undefined);
  expect(control.signal?.aborted).toBe(true);

  setTimeout(() => {
    expect(control.r_data).toBe(undefined);
    done();
  }, 10);
});

it("no abort", done => {
  const [control] = testComponent(
    component(() => {
      const [r_err, r_data] = awaited(async () => {
        await sleep(10);
        return 1;
      });

      return {
        r_err,
        r_data,
        signal: abortSignal(),
      };
    }),
  );

  expect(control.r_err).toBe(undefined);
  expect(control.r_data).toBe(undefined);
  expect(control.signal?.aborted).toBe(false);

  setTimeout(() => {
    expect(control.r_data).toBe(1);
    expect(control.signal?.aborted).toBe(false);
    done();
  }, 10);
});

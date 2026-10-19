import { testComponent } from "../testComponent";
import { component, effect } from "steel-frame";

it("has object fields", function () {
  const [control] = testComponent(
    component(() => {
      let wr_obj = { a: 1, b: 2 };
      let wr_a = wr_obj.a;
      let wr_b = wr_obj.b;

      const counter = { a: 0, b: 0, obj: 0 };

      effect(() => {
        void wr_a;
        counter.a++;
      });
      effect(() => {
        void wr_b;
        counter.b++;
      });
      effect(() => {
        void wr_obj;
        counter.obj++;
      });

      return {
        r_obj: wr_obj,
        r_a: wr_a,
        r_b: wr_b,
        counter,
        setA(value: number) {
          wr_a = value;
        },
        setB(value: number) {
          wr_b = value;
        },
        setObj(value: { a: number; b: number }) {
          wr_obj = value;
        },
      };
    }),
  );

  expect(control.r_a).toBe(1);
  expect(control.r_b).toBe(2);
  expect(control.counter).toEqual({ a: 1, b: 1, obj: 1 });

  control.setA(3);

  expect(control.r_a).toBe(3);
  expect(control.r_b).toBe(2);
  expect(control.r_obj).toEqual({ a: 3, b: 2 });
  expect(control.counter).toEqual({ a: 2, b: 1, obj: 2 });

  control.setB(4);

  expect(control.r_a).toBe(3);
  expect(control.r_b).toBe(4);
  expect(control.r_obj).toEqual({ a: 3, b: 4 });
  expect(control.counter).toEqual({ a: 2, b: 2, obj: 3 });

  control.setObj({ a: 5, b: 6 });

  expect(control.r_a).toBe(5);
  expect(control.r_b).toBe(6);
  expect(control.r_obj).toEqual({ a: 5, b: 6 });
  expect(control.counter).toEqual({ a: 3, b: 3, obj: 4 });

  control.setObj({ a: 6, b: 6 });
  expect(control.r_a).toBe(6);
  expect(control.r_b).toBe(6);
  expect(control.r_obj).toEqual({ a: 6, b: 6 });
  expect(control.counter).toEqual({ a: 4, b: 3, obj: 5 });
});

it("has deep fields", function () {
  const control = testComponent(
    component(() => {
      let wr_obj = { a: { b: 1 } };
      let wr_a = wr_obj.a;
      let wr_b = wr_obj.a.b;

      const counter = { a: 0, b: 0, obj: 0 };

      effect(() => {
        void wr_a;
        counter.a++;
      });
      effect(() => {
        void wr_b;
        counter.b++;
      });
      effect(() => {
        void wr_obj;
        counter.obj++;
      });

      return {
        r_obj: wr_obj,
        r_a: wr_a,
        r_b: wr_b,
        counter,
        setA(value: { b: number }) {
          wr_a = value;
        },
        setB(value: number) {
          wr_b = value;
        },
        setObj(value: { a: { b: number } }) {
          wr_obj = value;
        },
      };
    }),
  );

  expect(control.r_a).toEqual({ b: 1 });
  expect(control.r_b).toBe(1);
  expect(control.counter).toEqual({ a: 1, b: 1, obj: 1 });

  control.setA({ b: 2 });

  expect(control.r_a).toEqual({ b: 2 });
  expect(control.r_b).toBe(2);
  expect(control.r_obj).toEqual({ a: { b: 2 } });
  expect(control.counter).toEqual({ a: 2, b: 2, obj: 2 });

  control.setB(3);

  expect(control.r_a).toEqual({ b: 3 });
  expect(control.r_b).toBe(3);
  expect(control.r_obj).toEqual({ a: { b: 3 } });
  expect(control.counter).toEqual({ a: 3, b: 3, obj: 3 });

  control.setObj({ a: { b: 4 } });

  expect(control.r_a).toEqual({ b: 4 });
  expect(control.r_b).toBe(4);
  expect(control.r_obj).toEqual({ a: { b: 4 } });
  expect(control.counter).toEqual({ a: 4, b: 4, obj: 4 });

  control.setA({ b: 4 });

  expect(control.r_a).toEqual({ b: 4 });
  expect(control.r_b).toBe(4);
  expect(control.r_obj).toEqual({ a: { b: 4 } });
  expect(control.counter).toEqual({ a: 5, b: 4, obj: 5 });
});

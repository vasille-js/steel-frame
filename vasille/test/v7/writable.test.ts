import { expr, Reactive, ref, toDeepFieldRef, toFieldRef } from "../../src/index.js";

it("checks if value is writable", function () {
    const ctx = new Reactive(0);
    const r = ref(0);
    const e = expr(ctx, v => v, [r]);
    const o = ref({});
    const f1 = toFieldRef(ctx, o, "x");
    const f2 = toDeepFieldRef(ctx, o, ["x", "y"]);

    expect(r.isWritable()).toBe(true);
    expect(e.isWritable()).toBe(false);
    expect(f1.isWritable()).toBe(true);
    expect(f2.isWritable()).toBe(true);
});

import { Reactive, Reference } from "../../../src/classes/index.js";
import { TestExpression } from "../page.js";

it("ivalue", function () {
    const ref = new Reference(22);
    const nullRef = new Reference(null);

    expect(JSON.stringify(ref)).toBe("22");
    expect(`${ref}`).toBe("22");
    expect(`${nullRef}`).toBe("iValue<void>");
});

it("expression", function () {
    const ctx = new Reactive(0);
    const a = new Reference(2);
    const b = new Reference(3);
    const c = new TestExpression((a, b) => a + b, [a, b], ctx);

    expect(c.V).toBe(5);
    a.V++;
    expect(c.V).toBe(6);

    c.destroy();
});

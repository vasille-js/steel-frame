import { Reactive, Reference } from "../../src/index.js";
import { ReadOnlyReference } from "../../src/value/reference.js";
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
    c.V = 10;
    expect(c.V).toBe(10);
    a.V++;
    expect(c.V).toBe(10);
    c.up(11);
    expect(c.V).toBe(11);

    c.destroy();
});

it("readonly reference", function () {
    const ref = new ReadOnlyReference(0);

    function test() {
        ref.V = 2;
    }

    expect(test).toThrow();
});

import { Expression, Reference } from "../../src/classes/index.js";
import { awaited, store } from "../../src/functions/index.js";
import { TestExpression } from "../classes/page.js";
import { createNode } from "./page.js";

let counter = 0;

it("awaited", function (done) {
    const [frag] = createNode();
    const promise = new Promise(rv => setTimeout(() => rv(2)));
    const errPromise = new Promise((_, rj) => setTimeout(() => rj(4)));
    const [successErr, successResult] = awaited(() => promise, frag);
    const [mustFailErr, mustFailResult] = awaited(() => errPromise, frag);
    const [counterError, counterState, increase] = awaited(() => {
        return new Promise((resolve, reject) => {
            if (counter < 2) {
                resolve(++counter);
            } else {
                reject(counter);
            }
        });
    }, frag);

    expect(successErr.V).toBeUndefined();
    expect(successResult.V).toBeUndefined();
    expect(mustFailErr.V).toBeUndefined();
    expect(mustFailResult.V).toBeUndefined();

    setTimeout(() => {
        expect(successErr.V).toBeUndefined();
        expect(successResult.V).toBe(2);
        expect(mustFailErr.V).toBe(4);
        expect(mustFailResult.V).toBeUndefined();
        expect(counterState.V).toBe(1);
        expect(counterError.V).toBeUndefined();
        increase();

        setTimeout(() => {
            expect(counterState.V).toBe(2);
            expect(counterError.V).toBeUndefined();
            increase();

            setTimeout(() => {
                expect(counterState.V).toBeUndefined();
                expect(counterError.V).toBe(2);
                frag.destroy(frag.sDeep);
                done();
            });
        });
    });
});

it("awaited with aborts", function (done) {
    const [frag] = createNode();
    let time = new Reference(500);
    let signals: AbortSignal[] = [];
    let finished: number[] = [];
    const expr = new TestExpression(
        time => (abortSignal: AbortSignal) => {
            signals.push(abortSignal);
            return new Promise((rv, rj) => {
                setTimeout(() => {
                    finished.push(time);
                    if (time > 10) {
                        rv(time);
                    } else {
                        rj(time);
                    }
                }, time);
            });
        },
        [time],
        frag,
    );
    const [counterError, counterState, reset] = awaited(expr, frag);

    expect(counterError.V).toBeUndefined();
    expect(counterState.V).toBeUndefined();

    time.V = 250;
    time.V = 100;
    time.V = 50;

    expect(signals.length).toBe(4);
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(true);
    expect(signals[2].aborted).toBe(true);
    expect(signals[3].aborted).toBe(false);

    setTimeout(() => {
        expect(counterState.V).toBe(50);
        expect(signals[3].aborted).toBe(true);
        expect(finished).toEqual([50]);

        time.V = 10;
        expect(signals.length).toBe(5);
        expect(counterError.V).toBeUndefined();
        expect(counterState.V).toBeUndefined();

        setTimeout(() => {
            expect(counterState.V).toBeUndefined();
            expect(counterError.V).toBe(10);

            time.V = 9;
            reset();
            expect(signals.length).toBe(7);
            expect(counterError.V).toBeUndefined();
            expect(counterState.V).toBeUndefined();

            setTimeout(() => {
                expect(counterState.V).toBeUndefined();
                expect(counterError.V).toBe(9);
                expect(finished).toEqual([50, 10, 9, 9, 100, 250, 500]);
                frag.destroy(frag.sDeep);
                done();
            }, 500);
        }, 11);
    }, 51);
});

it("awaited synchronous", function () {
    const [frag] = createNode();
    const [successErr, successResult] = awaited(() => {
        return 2 as unknown as Promise<2>;
    }, frag);
    const [mustFailErr, mustFailResult] = awaited((): Promise<4> => {
        throw 4;
    }, frag);

    expect(successErr.V).toBeUndefined();
    expect(successResult.V).toBe(2);
    expect(mustFailErr.V).toBe(4);
    expect(mustFailResult.V).toBeUndefined();
    frag.destroy(frag.sDeep);
});

it("store test", function () {
    const S0 = store(() => {
        return {
            a: 0,
        };
    });
    const S1 = store(() => {
        return {
            a: new Reference(2),
            b: new Reference(undefined),
        };
    });

    const s0 = S0 as { a: number };
    const s1 = S1;

    expect(s0.a).toBe(0);
    expect(s1.a.V).toBe(2);
    expect(s1.b.V).toBeUndefined();
});

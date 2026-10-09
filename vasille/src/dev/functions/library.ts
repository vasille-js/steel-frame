import { IValue, Reactive } from "../../classes/index.js";
import { awaited } from "../../functions/index.js";
import { StaticPosition } from "../classes/index.js";
import { devRef } from "./internal.js";

type DebugData = readonly [StaticPosition, string | undefined];

export function devAwaited<T>(
    target: () => Promise<T>,
    declaration: [DebugData, DebugData],
    ctx: Reactive,
): [IValue<unknown, unknown>, IValue<unknown, unknown>, () => void, (reason?: unknown) => void] {
    let i = 0;
    return awaited(target, ctx, v => devRef(v, ctx, ...declaration[i++]!));
}

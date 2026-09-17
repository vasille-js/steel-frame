import { IValue } from "../core/ivalue.js";
import { safe } from "../functional/safety.js";
import { Fragment } from "./node.js";
import { IRunner } from "./runner.js";

export class Zombie<
    Node,
    Element,
    TagOptions extends object,
    Runner extends IRunner<Node, Element, TagOptions> = IRunner<Node, Element, TagOptions>,
> extends Fragment<Node, Element, TagOptions, Runner> {
    public readonly time: IValue<number, unknown>;
    public readonly trigger: () => void;

    public constructor(runner: Runner, time: IValue<number, unknown>, trigger: () => void) {
        super(runner, 0);

        this.time = time;
        this.trigger = safe(trigger);
    }

    public override compose() {
        this.refreshDeep(0);
    }

    public override destroy(deep: number, keepNodes?: boolean) {
        if (keepNodes) {
            super.destroy(deep, keepNodes);
        } else {
            this.trigger();
            setTimeout(() => super.destroy(deep), this.time.V);
        }
    }
}

import { expr, IValue, ref, Switch } from "vasille";
import { shadow } from "../../../src/shadow/lib.ts";

interface Props {
    $idNumber: IValue<number, unknown>;
    $name: IValue<string, unknown>;
    $visible: IValue<boolean, unknown>;
    $prop: IValue<number, unknown>;
    onItemHide: (isHide: boolean) => void;
    onvisible: () => void;
}

export function register() {
    shadow(
        (node, input: Props) => {
            let altName = ref<string | undefined>(undefined);

            expr(
                node,
                visible => {
                    if (!visible) {
                        input.onItemHide(true);
                    } else {
                        input.onvisible();
                    }
                },
                [input.$visible],
            );

            node.tag("div", {}, div => {
                div.text(expr(div, (n1, n2) => `${n1}+${n2}`, [input.$idNumber, input.$prop]));
            });
            node.tag("div", {}, div => {
                div.text(expr(div, (n1, n2) => n1 ?? n2, [altName, input.$name]));
            });
            Switch(
                {
                    cases: [
                        {
                            $case: input.$visible,
                            slot: ctx => {
                                ctx.tag("div", {});
                            },
                        },
                    ],
                },
                node,
            );

            return {
                setId(id: number) {
                    input.$idNumber.V = id;
                },
                get altName(): string | undefined {
                    return altName.V;
                },
                set altName(name: string | undefined) {
                    altName.V = name;
                },
            };
        },
        "shadow-node",
        {
            $idNumber: 2,
            $prop: 2,
            $name: 1,
            $visible: 3,
            onItemHide: 0,
            onvisible: 0,
        },
    );
}

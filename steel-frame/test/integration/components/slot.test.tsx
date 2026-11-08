import { testComponent } from "../testComponent.js";
import { beforeMount, component, Slot } from "steel-frame";

interface SubProps {
    slot?: () => void;
    slot1?: (props: { $x: number }) => void;
    slot2?: (props: { $x: number }) => void;
}

export let control:
    | {
          setX(x: number): void;
      }
    | undefined = undefined;

export const xes: number[] = [];

const SubComponent = component((props: SubProps) => {
    const { slot, slot1, slot2 } = props;
    let $x = 0;

    beforeMount(() => {
        if (slot1) {
            control = {
                setX(_x: number) {
                    $x = _x;
                },
            };
        }
    });

    <Slot model={slot} />;
    <Slot model={slot1} $x={$x}>
        <div>slot 1 default</div>
    </Slot>;
    <Slot model={slot2} $x={3} />;
});

it("Slot component test", function () {
    const [_control, body] = testComponent(
        component(() => {
            <div>
                <SubComponent />
            </div>;
            <div>
                <SubComponent>
                    <div>child</div>
                </SubComponent>
            </div>;
            <div>
                <SubComponent
                    slot1={props => {
                        const { $x } = props;
                        beforeMount(() => xes.push($x));
                        <div>child{$x}</div>;
                    }}
                />
            </div>;
            <div>
                <SubComponent
                    slot2={props => {
                        const { $x } = props;
                        beforeMount(() => xes.push($x));
                        <div>child{$x}</div>;
                    }}
                />
            </div>;
        }),
    );

    xes.forEach((item, index) => {
        expect(item).toBe(index === 0 ? 0 : 3);
    });
    expect(body.children.length).toBe(4);
    expect(body.children[0].children.length).toBe(1);
    expect(body.children[0].children[0].innerHTML).toBe("slot 1 default");
    expect(body.children[1].children.length).toBe(2);
    expect(body.children[1].children[0].innerHTML).toBe("child");
    expect(body.children[1].children[1].innerHTML).toBe("slot 1 default");
    expect(body.children[2].children.length).toBe(1);
    expect(body.children[2].children[0].innerHTML).toBe("child0");
    expect(body.children[3].children.length).toBe(2);
    expect(body.children[3].children[0].innerHTML).toBe("slot 1 default");
    expect(body.children[3].children[1].innerHTML).toBe("child3");
    control?.setX(1);
    expect(body.children[2].children[0].innerHTML).toBe("child1");
});

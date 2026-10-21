import { view, If, Else, ref, component } from "steel-frame";

export const IfElseTest = component(() => {
  <>
    <If $condition={$state === "if"}>
      <div>if</div>
    </If>
    <Else>
      <div>else</div>
    </Else>
  </>;
});

let $state = ref("test");

export const control = {
  setValue(value: string) {
    $state = value;
  },
};

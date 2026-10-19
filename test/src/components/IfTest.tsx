import { view, If, ref, component } from "steel-frame";

export const IfTest = component(() => {
  <If $condition={$state === "if"}>
    <div>{$state}</div>
  </If>;
});

let $state = ref("test");

export const control = {
  setValue(value: string) {
    $state = value;
  },
};

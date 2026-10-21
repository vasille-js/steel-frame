import { view, Delay, ref, component } from "steel-frame";

export const DelayTest = component(() => {
  <Delay time={1}>
    <div>{$state}</div>
  </Delay>;
});

let $state = ref("test");

export const control = {
  setValue(value: string) {
    $state = value;
  },
};

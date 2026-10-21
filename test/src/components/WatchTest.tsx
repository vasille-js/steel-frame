import { beforeMount, component, ref, view, Watch } from "steel-frame";

export const WatchTest = component(() => {
  <Watch
    $model={$state}
    slot={value => {
      beforeMount(() => {
        strings.push(value);
      });
      <div>{value}</div>;
    }}
  />;
});

let $state = ref("test");

export const strings: string[] = [];
export const control = {
  setValue(value: string) {
    $state = value;
  },
};

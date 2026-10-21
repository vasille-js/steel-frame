import { component, raw, ref, view } from "steel-frame";

export const StoredTest = component(() => {
  <div>Hello {text}!</div>;
});

let $r = ref("test");
const text = raw($r);

export const control = {
  setValue(value: string) {
    $r = value;
  },
};

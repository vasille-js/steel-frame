import { component, ref, view } from "steel-frame";

export const ReactiveObjectTest = component(() => {
  <div>Hello {data.$text}!</div>;
});

const data = { $text: ref("test") };

export const control = {
  setValue(value: string) {
    data.$text = value;
  },
};

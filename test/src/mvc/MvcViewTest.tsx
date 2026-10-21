import { component, ref } from "steel-frame";

interface Models {
  model: { $value: number };
}

export const MvcViewTest = component(() => {
  <MvcComponent model={{ $value }} />;
});

const MvcComponent = component((props: Models) => {
  const { model } = props;
  const { $value } = model;
  <div>{$value}</div>;
  <div>{$value + 2}</div>;
});

let $value = ref(1);

export const control = {
  setValue(x: number) {
    $value = x;
  },
};

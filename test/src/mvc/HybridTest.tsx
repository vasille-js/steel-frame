import { beforeMount, component, ref } from "steel-frame";

interface Models {
  model: { $value: number };
}

interface Props {
  $number: number;
}

export const HybridTest = component(() => {
  let $number = 10;

  beforeMount(() => {
    control.setInnerValue = (value: number) => {
      $number = value;
    };
  });

  <HybridComponent model={{ $value: $value }} $number={$number} />;
});

const HybridComponent = component((props: Models & Props) => {
  const { model, $number } = props;
  const { $value } = model;
  <div>
    {$value}+{$number}
  </div>;
  <div>
    {$value + 2}+{$number + 2}
  </div>;
});

let $value = ref(1);

export const control: {
  setValue(value: number): void;
  setInnerValue?(value: number): void;
} = {
  setValue(x: number) {
    $value = x;
  },
};

import { beforeMount, component, ref } from "steel-frame";

interface EndProps extends Props {
  $model: number;
}

interface Models {
  model: { $value: number };
}

interface Props {
  $root: number;
}

export const InterpolationTest = component(() => {
  let $root = 10;
  let $model = ref(12);

  beforeMount(() => {
    control = {
      setModelValue(value: number) {
        $model = value;
      },
      setRootValue(value: number) {
        $root = value;
      },
    };
  });

  <HybridComponent model={{ $value: $model }} $root={$root} />;
});

const EndComponent = component((props: EndProps) => {
  const { $model, $root } = props;
  <div>
    {$root} to {$model}
  </div>;
});

const HybridComponent = component((props: Models & Props) => {
  const { model, $root } = props;
  <EndComponent $model={model.$value} $root={$root} />;
});

export let control:
  | {
      setModelValue(value: number): void;
      setRootValue(value: number): void;
    }
  | undefined = undefined;

import { compose } from "steel-frame";

interface Props {
  $a: {
    b: number;
  };
}

const C = compose((props: Props) => {
  const {
    $a: { b },
  } = props;
});

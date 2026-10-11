import * as DX from "vasille-web";
const C = DX.compose((Vasille, props) => {
  const {
    $a = DX.ref(void 0, Vasille)
  } = props;
  DX.safe(() => $a.V = 3)();
});
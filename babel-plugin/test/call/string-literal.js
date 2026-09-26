import * as DX from "vasille-web";
const C = DX["compose"]((Vasille, props) => {
  const {
    a
  } = props;
  DX.safe(() => a = 3)();
});
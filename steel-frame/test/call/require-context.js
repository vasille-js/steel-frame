import * as DX from "vasille-web";
const promise0 = () => new Promise(rv => {
  rv(0);
});
const C = DX.compose(Vasille => {
  const [$err, $result, retry] = DX.awaited(() => promise0(), Vasille);
  DX.safe(() => console.log($err.V, $result.V, retry))();
});
import { awaited, compose, safe as VasilleSafe } from "vasille-web";
const C = compose(Vasille => {
  // @ts-expect-error
  const [$err, $data] = awaited(new Promise(rv => rv(2)), Vasille);
  VasilleSafe(() => console.log($err.V, $data.V))();
});

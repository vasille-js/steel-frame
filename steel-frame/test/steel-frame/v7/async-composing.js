import { awaited, compose } from "vasille-web";
function promise() {
  return new Promise(resolve => resolve(1));
}
const C = compose(async Vasille => {
  const [$err, $data] = await awaited(() => promise(), Vasille);
  await C({}, Vasille);
});
import { compose, ref, safe as VasilleSafe } from "vasille-web";
const o1 = {
  $x: ref(1)
};
const o2 = {
  $x: ref(1)
};
const C = compose(Vasille => {
  const o3 = {
    $x: ref(1, Vasille)
  };
  VasilleSafe(() => o1.$x.V = 2)();
  VasilleSafe(() => o2.$x.V = 2)();
  VasilleSafe(() => o3.$x.V = 3)();
});

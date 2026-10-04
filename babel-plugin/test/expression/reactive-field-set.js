import { compose, ref, set as VasilleSet, safe as VasilleSafe } from "vasille-web";
let o1 = {
  $x: ref(1)
};
const o2 = {
  $x: ref(1)
};
const C = compose(Vasille => {
  const arr = [0, 1];
  let index = 0;
  const o3 = {
    $x: ref(1, Vasille)
  };
  VasilleSafe(() => {
    VasilleSet(Vasille, o1, "$x", 2);
    o2.$x.V = 2;
    o3.$x.V = 3;
    arr[0] = 1;
    arr[index] = 2;
    arr["1"] = 3;
    o3["$x"].V = 4;
  })();
});
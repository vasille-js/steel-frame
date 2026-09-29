import { compose, model, ref as VasilleRef, safe as VasilleSafe } from "vasille-web";
const testModel = model(Vasille => {
  const $a = VasilleRef(1, Vasille);
  return {
    $a
  };
});
const test2Model = model((Vasille, props) => {
  return {
    $a: VasilleRef(props.a, Vasille)
  };
});
const C = compose(Vasille => {
  const test1 = testModel(Vasille);
  const test2 = test2Model(Vasille, {
    a: 1
  });
  VasilleSafe(() => {
    test1.$a?.V;
    test2.$a?.V;
  })();
});
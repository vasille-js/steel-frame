import { compose, ref, watch, ensure as VasilleEnsure } from "vasille-web";
class Class {
  #obj = {
    $prop: ref(2)
  };
  compose() {
    return compose(Vasille => {
      const $prop1 = VasilleEnsure(this.#obj, "$prop");
      const $prop2 = VasilleEnsure(this.#obj, "$prop");
      watch(Vasille, (Vasille_0, Vasille_1) => {
        let x = [Vasille_0, Vasille_1];
      }, [$prop1, $prop2]);
    });
  }
}
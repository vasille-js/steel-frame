import { compose, ref, watch } from "steel-frame";

class Class {
  #obj = {
    $prop: ref(2),
  };

  compose() {
    return compose(() => {
      const $prop1 = this.#obj.$prop;
      const $prop2 = this.#obj["$prop"];
      watch(() => {
        let x = [$prop1, $prop2];
      });
    });
  }
}

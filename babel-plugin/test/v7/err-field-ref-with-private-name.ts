import { compose, fieldRef } from "steel-frame";

class A {
  #x = 3;

  public C() {
    return compose(() => {
      let $ = fieldRef(this.#x);
    });
  }
}

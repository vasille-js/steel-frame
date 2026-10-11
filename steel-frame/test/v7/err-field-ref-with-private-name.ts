import { compose, field } from "steel-frame";

class A {
  #x = 3;

  public C() {
    return compose(() => {
      let $ = field(this.#x);
    });
  }
}

import { calculate, compose, ref as VasilleRef } from "vasille-web";
const C = compose(Vasille => {
  const $a = VasilleRef(1, Vasille);
  const o = {
    b: 1
  };
  const $c = calculate(Vasille, Vasille_0 => {
    o.b++;
    do {
      Vasille_0 + 1;
    } while (Vasille_0 < 1);
    for (const i in [0, 1]) {
      Vasille_0 + 1;
    }
    for (const i of [0, 1]) {
      Vasille_0 + 1;
    }
    for (let i = Vasille_0; i < Vasille_0; i += Vasille_0) {
      Vasille_0 + 1;
    }
    let a;
    for (a = 3; a < 4; a++) {
      Vasille_0 + 1;
    }
    label: if (Vasille_0 < 3) {
      Vasille_0 + 1;
    }
    switch (Vasille_0) {
      case Vasille_0:
        Vasille_0 + 1;
        break;
    }
    try {
      throw Vasille_0;
    } catch (e) {
      Vasille_0 + 1;
    } finally {
      Vasille_0 + 1;
    }
    while (Vasille_0 < 1) {
      Vasille_0 + 1;
    }
    return 0;
  }, [$a]);
});
import { store, ref as VasilleRef } from "vasille-web";
const userStore = store(Vasille => {
  const $a = VasilleRef(1, Vasille);
  return {
    $a
  };
});
userStore.$a?.V;

const VasilleFilePath = "steel-frame/test/dev/page.ts";
import { page, ref as VasilleRef } from "steel-frame";
export default page(async Vasille => {
  const $a = VasilleRef(1, Vasille, [VasilleFilePath, 4, 8, 4, 14], "$a");
}, [VasilleFilePath, 3, 15, 5, 2], "#");

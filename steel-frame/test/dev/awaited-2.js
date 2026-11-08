const VasilleFilePath = "steel-frame/test/dev/awaited-2.ts";
import { awaited, component } from "steel-frame";
const C = component(Vasille => {
  const [] = awaited(async () => {
    return 1;
  }, [[[VasilleFilePath, 4, 10, 4, 12], "#"], [[VasilleFilePath, 4, 10, 4, 12], "#"]], Vasille);
}, [VasilleFilePath, 3, 10, 7, 2], "C");

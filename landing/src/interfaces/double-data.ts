import { CssStyleInjector } from "steel-frame";

export interface DoubleData {
  classes: (string | CssStyleInjector)[];
  isDark: boolean;
}

export interface DoubleDataProps {
  content?(props: DoubleData): void;
  slot?(props: DoubleData): void;
}

import { context, CssStyleInjector } from "steel-frame";

interface Props {
  r_class: false | CssStyleInjector;
}

export const noTransitions = context((props: Props) => {
  return props;
});

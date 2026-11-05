import { component, receive, Slot } from "steel-frame";
import { DoubleDataProps } from "../../interfaces/double-data.js";
import { DoubleDescription } from "../DoubleDescription.js";
import { noTransitions } from "../../context/noTransitions.js";

export const FeatureDescription = component(
  ({ slot, content }: DoubleDataProps) => {
    const noTransition = receive(noTransitions);
    const r_none = noTransition.r_class;

    <DoubleDescription
      description={(props) => {
        <div class={[...props.classes, r_none]}>
          <Slot model={content ?? slot} {...props} />
        </div>;
      }}
    />;
  },
);

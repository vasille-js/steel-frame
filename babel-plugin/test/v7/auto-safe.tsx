import { compose } from "steel-frame";

const C1 = compose<{ required: number; optional?: number }>(props => {
  <div>
    {props.required}
    {props.optional}
  </div>;
});

function throwNow(): number {
  throw new Error("x");
}

const C2 = compose(() => {
  <C1 required={1} />;
  <C1 required={1} optional={throwNow()} />;
  <C1 required={throwNow()} optional={1} />;
  <C1 required={throwNow()} optional={throwNow()} />;
});

import { compose } from "steel-frame";

const C = compose(() => {
  const arr = [1, 2];

  <div>
    {arr.map(item => (
      <div>{item}</div>
    ))}
  </div>;
});

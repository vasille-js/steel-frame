import { arrayModel, compose } from "steel-frame";

const C = compose(() => {
  const a = arrayModel([{ x: 1 }, { x: 2 }]);

  <div>
    {a.map(item => (
      <div>{item.x}</div>
    ))}
  </div>;
});

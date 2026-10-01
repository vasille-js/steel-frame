import { compose } from "steel-frame";

const C = compose(() => {
  let $x = 1;

  <div
    callback={div => {
      div.style.display = "none";

      return () => {
        div.style.display = "block";
      };
    }}
  >
    {$x}
  </div>;

  return { $x };
});

const C1 = compose(() => {
  <C
    callback={obj => {
      obj.$x satisfies number;
      return () => {
        console.log("x", obj.$x);
      };
    }}
  ></C>;
});

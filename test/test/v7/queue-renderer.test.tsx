import { testComponent } from "../testComponent";
import { arrayModel, ArrayModelView, component, QueuedRender } from "steel-frame";

it("renders in queue", function (done) {
  const [control, body] = testComponent(
    component(() => {
      const arr = arrayModel([1, 2, 3, 4, 5, 6, 7]);

      <ArrayModelView
        of={arr}
        slot={value => {
          <QueuedRender>
            <div>{value}</div>
          </QueuedRender>;
        }}
      />;
    }),
  );

  expect(body.children.length).toBe(0);

  setTimeout(() => {
    expect(body.children.length).toBe(7);
    done();
  });
});

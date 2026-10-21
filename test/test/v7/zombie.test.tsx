import { testComponent } from "../testComponent";
import { component, If, Zombie } from "steel-frame";

it("has zombie", function (done) {
  const [control, body, app] = testComponent(
    component(() => {
      let wr_exists = true;

      <If r_condition={wr_exists}>
        <Zombie r_time={10}>
          <div />
        </Zombie>
      </If>;

      return {
        setExists(value: boolean) {
          wr_exists = value;
        },
      };
    }),
  );

  expect(body.children.length).toBe(1);
  control.setExists(false);
  expect(body.children.length).toBe(1);
  control.setExists(true);
  expect(body.children.length).toBe(2);

  setTimeout(() => {
    expect(body.children.length).toBe(1);
    control.setExists(false);
    expect(body.children.length).toBe(1);
    setTimeout(() => {
      expect(body.children.length).toBe(0);
      done();
    }, 10);
  }, 10);
});

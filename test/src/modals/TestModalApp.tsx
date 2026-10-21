import { component, modal } from "steel-frame";

interface Props {
  title: string;
}

export const TestModalApp = component(() => {
  <div class="root">
    <Modal title={"test"} />
  </div>;
});

const Modal = modal((props: Props) => {
  <div class="modal">{props.title}</div>;
});

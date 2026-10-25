import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Comment } from "../Comment.js";
import { Highlight } from "../Highlight.js";
import { Keyword } from "../Keyword.js";

/*
 * // Wrap a function in a "component" call to use it as a custom element.
 * const MyComponent = component(() => {
 *   <h1>Hello World</h1>;
 * });
 * mount(document.body, MyComponent, {});
 * */

export const ComponentExample = component(() => {
  <CodeLine number={1}>
    <Comment>
      // Wrap a function in a "component" call to use it as a custom element
    </Comment>
  </CodeLine>;

  <CodeLine number={2}>
    {"const "}
    <Highlight>MyComponent</Highlight>
    {" = "}
    <Keyword>component</Keyword>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={3}>
    <Comment>{"  // Paste any valid HTML here"}</Comment>
  </CodeLine>;
  <CodeLine number={4}>
    {"  <"}
    <Keyword>h1</Keyword>
    {">Hello World</"}
    <Keyword>h1</Keyword>
    {">"}
  </CodeLine>;
  <CodeLine number={5}>{"});"}</CodeLine>;
  <CodeLine number={6}>
    <Comment>{"// Mount the component"}</Comment>
  </CodeLine>;
  <CodeLine number={7}>
    {"mount(document.body, "}
    <Highlight>MyComponent</Highlight>
    {", {});"}
  </CodeLine>;
  <CodeLine number={8} />;
});

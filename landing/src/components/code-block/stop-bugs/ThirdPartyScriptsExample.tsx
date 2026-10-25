import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Comment } from "../Comment.js";
import { Highlight } from "../Highlight.js";
import { Keyword } from "../Keyword.js";

/**
 * // Third party scripts fail to load when of CDN is down
 * const MyComponent = component(() => {
 *   function onClick() {
 *     // the error here is automatically catch and reported
 *     window.$("button").text("Hello World!");
 *   }
 *
 *   <button onclick={onClick}>Click me</button>;
 *
 *   afterMount(() => {
 *     // the error here is automatically catch and reported
 *     window.$("button").addClass("active");
 *   });
 * });
 */

export const ThirdPartyScriptsExample = component(() => {
  <CodeLine number={1}>
    <Comment>
      {"// Third party scripts fail to load when of CDN is down"}
    </Comment>
  </CodeLine>;
  <CodeLine number={2}>
    {"const MyComponent = "}
    <Highlight>component</Highlight>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={3}>
    {"  function "}
    <Keyword>onClick</Keyword>
    {"() {"}
  </CodeLine>;
  <CodeLine number={4}>
    <Comment>
      {"    // the errors here are automatically catch and reported"}
    </Comment>
  </CodeLine>;
  <CodeLine number={5}>
    <>{'    window.$("button").text("Hello World!");'}</>
  </CodeLine>;
  <CodeLine number={6}>{"  }"}</CodeLine>;
  <CodeLine number={7} />;
  <CodeLine number={8}>
    {"  <button onclick={"}
    <Keyword>onClick</Keyword>
    {"}>Click me</button>"}
  </CodeLine>;
  <CodeLine number={9} />;
  <CodeLine number={10}>
    <Highlight>{"  afterMount"}</Highlight>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={11}>
    <Comment>
      {"    // the errors here are automatically catch and reported"}
    </Comment>
  </CodeLine>;
  <CodeLine number={12}>
    {'    window.$("button").addClass("active");'}
  </CodeLine>;
  <CodeLine number={13}>{"  });"}</CodeLine>;
  <CodeLine number={14}>{"});"}</CodeLine>;
  <CodeLine number={15} />;
});

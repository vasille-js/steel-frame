import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Highlight } from "../Highlight.js";
import { Keyword } from "../Keyword.js";
import { Comment } from "../Comment.js";

/**
 * import { formatTime } from "npm-package";
 *
 * const MyComponent = component(() => {
 *   function onClick() {
 *     // do something
 *   }
 *   // The button is shown and onClick will be called on click
 *   // even if the formatTime function throws an error
 *   <button onclick={onClick}>{formatTime(new Date())}</button>;
 * });
 */

export const NpmUpdateExample = component(() => {
  <CodeLine number={1}>
    {"import { "}
    <Highlight>formatTime</Highlight>
    {' } from "npm-package";'}
  </CodeLine>;
  <CodeLine number={2} />;
  <CodeLine number={3}>
    {"const MyComponent = "}
    <Highlight>component</Highlight>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={4}>
    {"  function "}
    <Keyword>onClick</Keyword>
    {"() {"}
  </CodeLine>;
  <CodeLine number={5}>
    <Comment>{"    // do something"}</Comment>
  </CodeLine>;
  <CodeLine number={6}>{"  }"}</CodeLine>;
  <CodeLine number={7}>
    <Comment>
      {"  // The button is shown and onClick will be called on click"}
    </Comment>
  </CodeLine>;
  <CodeLine number={8}>
    <Comment>{"  // even if the formatTime function throws an error"}</Comment>
  </CodeLine>;
  <CodeLine number={9}>
    {"  <button onclick={"}
    <Keyword>onClick</Keyword>
    {"}>"}
    <Highlight>formatTime</Highlight>
    {"(new Date())}</button>"}
  </CodeLine>;
  <CodeLine number={10}>{"});"}</CodeLine>;
  <CodeLine number={11} />;
});

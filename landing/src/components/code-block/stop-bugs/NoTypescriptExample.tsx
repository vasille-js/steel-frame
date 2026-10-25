import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Comment } from "../Comment.js";
import { Highlight } from "../Highlight.js";
import { Keyword } from "../Keyword.js";

/**
 * // Button props were changed
 * // Backward compatibility is missing
 * import Button from "./Button.js";
 *
 * const MyComponent = component(() => {
 *   // This usage will throw an error
 *   <Button height={"24"}>Click me</Button>;
 *   // This usage will work fine
 *   // Even if the previous usage throws an error
 *   <Button height={24}>Click me</Button>;
 * })
 */

export const NoTypescriptExample = component(() => {
  <CodeLine number={1}>
    <Comment>{"// Button props were changed"}</Comment>
  </CodeLine>;
  <CodeLine number={2}>
    <Comment>{"// Backward compatibility is missing"}</Comment>
  </CodeLine>;
  <CodeLine number={3}>
    {"import "}
    <Highlight>Button</Highlight>
    {' from "./Button.js";'}
  </CodeLine>;
  <CodeLine number={4} />;
  <CodeLine number={5}>
    {"const MyComponent = "}
    <Keyword>component</Keyword>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={6}>
    <Comment>{"  // This usage will throw an error"}</Comment>
  </CodeLine>;
  <CodeLine number={7}>
    {"  <"}
    <Highlight>Button</Highlight>
    {' height={"24"}>Click me</'}
    <Highlight>Button</Highlight>
    {">"}
  </CodeLine>;
  <CodeLine number={8}>
    <Comment>{"  // This usage will work fine"}</Comment>
  </CodeLine>;
  <CodeLine number={9}>
    <Comment>{"  // Even if the previous usage throws an error"}</Comment>
  </CodeLine>;
  <CodeLine number={10}>
    {"  <"}
    <Highlight>Button</Highlight>
    {" height={24}>Click me</"}
    <Highlight>Button</Highlight>
    {">"}
  </CodeLine>;
  <CodeLine number={11}>{"});"}</CodeLine>;
  <CodeLine number={12} />;
});

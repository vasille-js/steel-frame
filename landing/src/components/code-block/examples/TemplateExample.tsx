import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Comment } from "../Comment.js";
import { Highlight } from "../Highlight.js";
import { Keyword } from "../Keyword.js";

/*
 * // Data from any source
 * // can be passed to the template
 * const name = "World";
 * // Example of a hello world component
 * const HelloWorld = component(() => {
 *   // Data can be local in the component
 *   const adjective = "Beautiful";
 *   // Passing adjective and name to the template
 *   <h1>Hello {adjective} {name}!</h1>;
 * });
 * */
export const TemplateExample = component(() => {
  <CodeLine number={1}>
    <Comment>// Data from any source can be passed to the template</Comment>
  </CodeLine>;
  <CodeLine number={2}>
    {"const "}
    <Highlight>name</Highlight>
    {" = 'World';"}
  </CodeLine>;
  <CodeLine number={3}>
    <Comment>// Example of a hello world component</Comment>
  </CodeLine>;
  <CodeLine number={4}>
    {"const HelloWorld = "}
    <Keyword>component</Keyword>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={5}>
    <Comment>{"  // Data can be local in the component"}</Comment>
  </CodeLine>;
  <CodeLine number={6}>
    {"  const "}
    <Highlight>adjective</Highlight>
    {" = 'Beautiful';"}
  </CodeLine>;
  <CodeLine number={7}>
    <Comment>{"  // Passing adjective and name to the template"}</Comment>
  </CodeLine>;
  // <h1>Hello {adjective} {name}!</h1>;
  <CodeLine number={8}>
    {"  <"}
    <Keyword>h1</Keyword>
    {">Hello {"}
    <Highlight>adjective</Highlight>
    {"} {"}
    <Highlight>name</Highlight>
    {"}!</"}
    <Keyword>h1</Keyword>
    {">"}
  </CodeLine>;
  <CodeLine number={9}>{"});"}</CodeLine>;
  <CodeLine number={10} />;
});

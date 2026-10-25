import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Comment } from "../Comment.js";
import { Highlight } from "../Highlight.js";
import { Keyword } from "../Keyword.js";

/*
 * const HelloWorld = component(() => {
 *   // This is a reactive state
 *   let $name = "World";
 *   // This is a derived reactive state
 *   const $message = `Hello ${$name}!`;
 *   // This function will update the reactive state
 *   function changeName() {
 *     $name = "Steel Frame Kit";
 *   }
 *   // Render the template
 *   <h1 onclick={changeName}>{$message}</h1>;
 * })
 * */
export const ReactiveExample = component(() => {
  <CodeLine number={1}>
    {"const HelloWorld = "}
    <Keyword>component</Keyword>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={2}>
    <Comment>{"  // This is a reactive state"}</Comment>
  </CodeLine>;
  <CodeLine number={3}>
    {"  let "}
    <Highlight>$name</Highlight>
    {" = 'World';"}
  </CodeLine>;
  <CodeLine number={4}>
    <Comment>{"  // This is a derived reactive state"}</Comment>
  </CodeLine>;
  <CodeLine number={5}>
    {"  const "}
    <Highlight>$message</Highlight>
    {" = `Hello ${"}
    <Highlight>$name</Highlight>
    {"}!`;"}
  </CodeLine>;
  <CodeLine number={6}>
    <Comment>{"  // This function will update the reactive state"}</Comment>
  </CodeLine>;
  <CodeLine number={7}>{"  function changeName() {"}</CodeLine>;
  <CodeLine number={8}>
    <span>{"    "}</span>
    <Highlight>$name</Highlight>
    {" = 'Steel Frame Kit';"}
  </CodeLine>;
  <CodeLine number={9}>{"  }"}</CodeLine>;
  <CodeLine number={10}>
    {"  <"}
    <Keyword>h1</Keyword>
    {" onclick={changeName}>{"}
    <Highlight>$message</Highlight>
    {"}</"}
    <Keyword>h1</Keyword>
    {">"}
  </CodeLine>;
  <CodeLine number={11}>{"});"}</CodeLine>;
  <CodeLine number={12} />;
});

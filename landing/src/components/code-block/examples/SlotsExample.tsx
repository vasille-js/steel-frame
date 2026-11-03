import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Highlight } from "../Highlight.js";
import { Keyword } from "../Keyword.js";

/*
 * interface Props {
 *   slot(): void;
 * }
 * const Hello = component<Props>(({slot}) => {
 *   <h1>
 *     Hello <Slot model={slot}/>!
 *   </h1>;
 * });
 * const HelloWorld = component(() => {
 *   <Hello>World</Hello>;
 * });
 *
 * */
export const SlotsExample = component(() => {
  <CodeLine number={1}>{"interface Props {"}</CodeLine>;
  <CodeLine number={2}>
    <span>{"  "}</span>
    <Highlight>slot</Highlight>
    {"(): void;"}
  </CodeLine>;
  <CodeLine number={3}>{"}"}</CodeLine>;
  <CodeLine number={4}>
    {"const Hello = "}
    <Keyword>component</Keyword>
    {"<Props>(({"}
    <Highlight>slot</Highlight>
    {"}) => {"}
  </CodeLine>;
  <CodeLine number={5}>
    {"  <"}
    <Keyword>h1</Keyword>
    {">"}
  </CodeLine>;
  <CodeLine number={6}>
    {"    Hello <Slot model={"}
    <Highlight>slot</Highlight>
    {"}/>!"}
  </CodeLine>;
  <CodeLine number={7}>
    {"  <"}
    <Keyword>h1</Keyword>
    {">;"}
  </CodeLine>;
  <CodeLine number={8}>{"});"}</CodeLine>;
  <CodeLine number={9}>
    {"const HelloWorld = "}
    <Keyword>component</Keyword>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={10}>
    {"  <Hello>"}
    <Highlight>World</Highlight>
    {"</Hello>;"}
  </CodeLine>;
  <CodeLine number={11}>{"});"}</CodeLine>;
  <CodeLine number={12} />;
});

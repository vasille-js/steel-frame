import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Highlight } from "../Highlight.js";
import { Keyword } from "../Keyword.js";

/*
 * interface Props {
 *   name: string;
 * }
 * const Hello = component<Props>(({name}) => {
 *   <h1>Hello {name}!</h1>;
 * });
 * const App = component(() => {
 *   <Hello name="World"/>;
 * });
 * */
export const PropertiesExample = component(() => {
  <CodeLine number={1}>{"interface Props {"}</CodeLine>;
  <CodeLine number={2}>
    <span>{"  "}</span>
    <Highlight>name</Highlight>
    {" : string;"}
  </CodeLine>;
  <CodeLine number={3}>{"}"}</CodeLine>;
  <CodeLine number={4}>
    {"const "}
    <Keyword>Hello</Keyword>
    {" = "}
    <Keyword>component</Keyword>
    {"<Props>(({"}
    <Highlight>name</Highlight>
    {"}) => {"}
  </CodeLine>;
  <CodeLine number={5}>
    {"  <"}
    <Keyword>h1</Keyword>
    {">Hello {"}
    <Highlight>name</Highlight>
    {"}!</"}
    <Keyword>h1</Keyword>
    {">;"}
  </CodeLine>;
  <CodeLine number={6}>{"});"}</CodeLine>;
  <CodeLine number={7}>
    {"const App = "}
    <Keyword>component</Keyword>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={8}>
    {"  <"}
    <Keyword>Hello</Keyword>
    <span>{"\xa0"}</span>
    <Highlight>name</Highlight>
    {'="World"/>;'}
  </CodeLine>;
  <CodeLine number={9}>{"});"}</CodeLine>;
  <CodeLine number={10} />;
});

import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Keyword } from "../Keyword.js";
import { Comment } from "../Comment.js";
import { Highlight } from "../Highlight.js";

/*
 * const App = component(() => {
 *   // The callback is called
 *   // when the element and children are mounted
 *   <div callback={div => {
 *     // div is an instance of HTMLDivElement
 *     div.querySelector("input").focus();
 *   }>
 *     <input type="text" oninput={(ev, input) => {
 *       // input is an instance of HTMLInputElement
 *       input.focus();
 *     }}/>
 *   </div>;
 * });
 *
 * */
export const DomExample = component(() => {
  <CodeLine number={1}>
    {"const App = "}
    <Keyword>component</Keyword>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={2}>
    <Comment>
      {"  // The callback is called when the element is mounted"}
    </Comment>
    ;
  </CodeLine>;
  <CodeLine number={3}>
    <Comment>{"  // Yes! Its children are mounted too!"}</Comment>;
  </CodeLine>;
  <CodeLine number={4}>
    {"  <"}
    <Keyword>div</Keyword>
    {" callback={"}
    <Highlight>div</Highlight>
    {" => {"}
  </CodeLine>;
  <CodeLine number={5}>
    <Comment>{"    // div is an instance of HTMLDivElement"}</Comment>;
  </CodeLine>;
  <CodeLine number={6}>
    <span>{"    "}</span>
    <Highlight>div</Highlight>
    {'.querySelector("input").focus();'}
  </CodeLine>;
  <CodeLine number={7}>{"  }>"}</CodeLine>;
  <CodeLine number={8}>
    {"    <"}
    <Keyword>input</Keyword>
    {' type="text" onmouseover={(ev, '}
    <Highlight>input</Highlight>
    {") => {"}
  </CodeLine>;
  <CodeLine number={9}>
    <Comment>{"      // input is an instance of HTMLInputElement"}</Comment>
  </CodeLine>;
  <CodeLine number={10}>
    <span>{"      "}</span>
    <Highlight>input</Highlight>
    {".focus();"}
  </CodeLine>;
  <CodeLine number={11}>{"    }}/>"}</CodeLine>;
  <CodeLine number={12}>
    {"  </"}
    <Keyword>div</Keyword>
    {">;"}
  </CodeLine>;
  <CodeLine number={13}>{"});"}</CodeLine>;
  <CodeLine number={14} />;
});

import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Keyword } from "../Keyword.js";
import { Highlight } from "../Highlight.js";
import { Comment } from "../Comment.js";

/**
 * export default page(({params}) => {
 *   // This error is caught automatically
 *   // A fallback screen will be shown
 *   // The request can be easily retried
 *   // Single solution for all critical data
 *   const profileData = await getProfile(params.id);
 *
 *   <UserProfile profile={profileData}/>;
 * });
 */

export const BackendIsDownExample = component(() => {
  <CodeLine number={1}>
    {"export default "}
    <Keyword>page</Keyword>
    {"(({"}
    <Highlight>params</Highlight>
    {"}) => {"}
  </CodeLine>;
  <CodeLine number={2}>
    <Comment>{"  // This error is caught automatically"}</Comment>
  </CodeLine>;
  <CodeLine number={3}>
    <Comment>{"  // A custom fallback screen will be shown"}</Comment>
  </CodeLine>;
  <CodeLine number={4}>
    <Comment>{"  // The request can be easily retried"}</Comment>
  </CodeLine>;
  <CodeLine number={5}>
    <Comment>{"  // Single solution for all critical data"}</Comment>
  </CodeLine>;
  <CodeLine number={6}>
    {"  const profileData = await getProfile("}
    <Highlight>params</Highlight>
    {".id);"}
  </CodeLine>;
  <CodeLine number={7} />;
  <CodeLine number={8}>{"  <UserProfile profile={profileData}/>;"}</CodeLine>;
  <CodeLine number={9}>{"});"}</CodeLine>;
  <CodeLine number={10} />;
});

import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Keyword } from "../Keyword.js";
import { Comment } from "../Comment.js";
import { Highlight } from "../Highlight.js";

/**
 * const MyComponent = component(() => {
 *   // use "error" to show an error message
 *   // use "profile" to show the profile
 *   // use "reload" to reload the profile
 *   // when the load fails and when the user requires reloading the profile
 *   const [$error, $profile, reload] = awaited(getProfile);
 *
 *   <>
 *     $error ? <ErrorComponent error={$error}/> :
 *     $profile ? <ProfileComponent profile={$profile}/> :
 *     <LoadingComponent />;
 *   </>
 * })
 */

export const OptionalDataExample = component(() => {
  <CodeLine number={1}>
    {"const MyComponent = "}
    <Keyword>component</Keyword>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={2}>
    <Comment>{'  // use "error" to show an error message'}</Comment>
  </CodeLine>;
  <CodeLine number={3}>
    <Comment>{'  // use "profile" to show the profile'}</Comment>
  </CodeLine>;
  <CodeLine number={4}>
    <Comment>{'  // use "reload" to reload the profile'}</Comment>
  </CodeLine>;
  <CodeLine number={5}>
    <Comment>{"  // when the user requires reloading the profile"}</Comment>
  </CodeLine>;
  <CodeLine number={6}>
    {"  const ["}
    <Highlight>$error</Highlight>
    {", "}
    <Highlight>$profile</Highlight>
    {", "}
    <Highlight>reload</Highlight>
    {"] = awaited(getProfile);"}
  </CodeLine>;
  <CodeLine number={7} />;
  <CodeLine number={8}>{"  <>"}</CodeLine>;
  <CodeLine number={9}>
    {"   \xA0"}
    <Highlight>$error</Highlight>
    {" ? <ErrorComponent error={"}
    <Highlight>$error</Highlight>
    {"}/> :"}
  </CodeLine>;
  <CodeLine number={10}>
    {"   \xA0"}
    <Highlight>$profile</Highlight>
    {" ? <ProfileComponent profile={"}
    <Highlight>$profile</Highlight>
    {"}/> :"}
  </CodeLine>;
  <CodeLine number={11}>
    <>{"   <LoadingComponent />;"}</>
  </CodeLine>;
  <CodeLine number={12}>{"  </>"}</CodeLine>;
  <CodeLine number={13}>{"});"}</CodeLine>;
  <CodeLine number={14} />;
});

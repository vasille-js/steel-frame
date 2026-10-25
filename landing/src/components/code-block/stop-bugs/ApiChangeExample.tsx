import { component } from "steel-frame";
import { CodeLine } from "../CodeLine.js";
import { Keyword } from "../Keyword.js";
import { Highlight } from "../Highlight.js";
import { Comment } from "../Comment.js";

export const ApiChangeExample = component(() => {
  <CodeLine number={1}>
    <Keyword>const</Keyword>
    {"\xA0"}
    <Highlight>ProductPage</Highlight>
    {" = "}
    <Keyword>component</Keyword>
    {"(() => {"}
  </CodeLine>;
  <CodeLine number={2}>
    <Comment>{"  // API changed? Data structure broken?"}</Comment>
  </CodeLine>;
  <CodeLine number={3}>
    <Keyword>const</Keyword>
    {" recommendations = "}
    <Highlight>getRecommendations</Highlight>
    {"(); "}
    <Comment>{"// Potential error"}</Comment>
  </CodeLine>;
  <CodeLine number={4} />;
  <CodeLine number={5}>
    <Comment>{"  // It it fails, only the recommendations disappear"}</Comment>
  </CodeLine>;
  <CodeLine number={6}>
    {"  <RecommendationSlider "}
    <Keyword>products</Keyword>
    {"="}
    <Keyword>{"{recommendations}"}</Keyword>
    {" />;"}
  </CodeLine>;
  <CodeLine number={7} />;
  <CodeLine number={8}>
    <Comment>{"  // These components keep working:"}</Comment>
  </CodeLine>;
  <CodeLine number={9}>
    {"  <ProductGallery />;   "}
    <Comment>{"// Always visible"}</Comment>
  </CodeLine>;
  <CodeLine number={10}>
    {"  <AddToCardButton />;  "}
    <Comment>{"// Always functional"}</Comment>
  </CodeLine>;
  <CodeLine number={11}>
    {"  <CustomersReviews />; "}
    <Comment>{"// Never affected"}</Comment>
  </CodeLine>;
  <CodeLine number={12}>{"});"}</CodeLine>;
  <CodeLine number={13} />;
});

import { page, receive, receiveOptional } from "steel-frame";

export default page<"/err-page-with-global-dependency">(async () => {
  const global = receive("global");
  const optional = receiveOptional("optional");
  // fails here mean that dependency checking is working
  const fail = receive("unexisting");
});

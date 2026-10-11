import { beforeMount, compose, router } from "steel-frame";

const C = compose(() => {
  beforeMount(() => {
    router()?.goTo("/correct");
    router()?.goTo("/correct/");
    router()?.goTo("/correct/123/item");
    router()?.goTo("/correct/123/item/");
    router()?.goTo("/correct/item/123");
    router()?.goTo("/correct/item/123/");
    router()?.goTo("/correct/123/item/edit");
    router()?.goTo("/correct/123/item/edit/");

    const id = "123";

    router()?.goTo(id);
    router()?.goTo(`/correct/${id}/item`);
    router()?.goTo(`/correct/${id}/item/`);
    router()?.goTo(`/correct/item/${id}`);
    router()?.goTo(`/correct/item/${id}${id}/`);
    router()?.goTo(`/correct/${id}/item/edit`);
    router()?.goTo(`/correct/${id}/item/edit/`);
    router()?.goTo(`/correct/${id}/item/edit/${id}`);
  });
});

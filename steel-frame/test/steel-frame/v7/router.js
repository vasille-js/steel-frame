import { compose, safe as VasilleSafe } from "vasille-web";
const C = compose(Vasille => {
  VasilleSafe(() => {
    Vasille.r.r?.goTo("/correct");
    Vasille.r.r?.goTo("/correct/");
    Vasille.r.r?.goTo("/correct/123/item");
    Vasille.r.r?.goTo("/correct/123/item/");
    Vasille.r.r?.goTo("/correct/item/123");
    Vasille.r.r?.goTo("/correct/item/123/");
    Vasille.r.r?.goTo("/correct/123/item/edit");
    Vasille.r.r?.goTo("/correct/123/item/edit/");
    const id = "123";
    Vasille.r.r?.goTo(id);
    Vasille.r.r?.goTo(`/correct/${id}/item`);
    Vasille.r.r?.goTo(`/correct/${id}/item/`);
    Vasille.r.r?.goTo(`/correct/item/${id}`);
    Vasille.r.r?.goTo(`/correct/item/${id}${id}/`);
    Vasille.r.r?.goTo(`/correct/${id}/item/edit`);
    Vasille.r.r?.goTo(`/correct/${id}/item/edit/`);
    Vasille.r.r?.goTo(`/correct/${id}/item/edit/${id}`);
  })();
});

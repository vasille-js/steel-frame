import { compose, safe as VasilleSafe } from "vasille-web";
const C = compose(Vasille => {
  VasilleSafe(() => {
    Vasille.runner.router?.goTo("/correct");
    Vasille.runner.router?.goTo("/correct/");
    Vasille.runner.router?.goTo("/correct/123/item");
    Vasille.runner.router?.goTo("/correct/123/item/");
    Vasille.runner.router?.goTo("/correct/item/123");
    Vasille.runner.router?.goTo("/correct/item/123/");
    Vasille.runner.router?.goTo("/correct/123/item/edit");
    Vasille.runner.router?.goTo("/correct/123/item/edit/");
    const id = "123";
    Vasille.runner.router?.goTo(id);
    Vasille.runner.router?.goTo(`/correct/${id}/item`);
    Vasille.runner.router?.goTo(`/correct/${id}/item/`);
    Vasille.runner.router?.goTo(`/correct/item/${id}`);
    Vasille.runner.router?.goTo(`/correct/item/${id}${id}/`);
    Vasille.runner.router?.goTo(`/correct/${id}/item/edit`);
    Vasille.runner.router?.goTo(`/correct/${id}/item/edit/`);
    Vasille.runner.router?.goTo(`/correct/${id}/item/edit/${id}`);
  })();
});
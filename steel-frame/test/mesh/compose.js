import { compose, For, ref as VasilleRef, safe as VasilleSafe, expr as VasilleExpr } from "vasille-web";
const C = compose(function C(Vasille, props) {
  const {
    $name = VasilleRef("name", Vasille),
    ["$data"]: $d = VasilleRef(void 0, Vasille),
    ...rest
  } = props;
  const model = [{
    $name: VasilleRef("name1", Vasille),
    $data: VasilleRef({
      id: "x",
      width: 1,
      height: 4
    }, Vasille),
    $more: VasilleRef("more", Vasille)
  }];
  VasilleSafe(() => console.log($d.V.id, $d.V.width, $d.V.height, $name.V, rest.$more?.V))();
  Vasille.tag("div", {}, Vasille => {
    Vasille.text(VasilleExpr(Vasille, Vasille_0 => Vasille_0.id, [$d]));
    Vasille.text(":");
    Vasille.text($name);
    Vasille.text(" ");
    Vasille.text(VasilleExpr(Vasille, Vasille_0 => Vasille_0.width, [$d]));
    Vasille.text("/");
    Vasille.text(VasilleExpr(Vasille, Vasille_0 => Vasille_0.height, [$d]));
    Vasille.text("...");
    Vasille.text(rest.$more);
  });
  For({
    of: model,
    slot: (Vasille, props) => {
      const {
        $name = VasilleRef("xName", Vasille),
        $data = VasilleRef(void 0, Vasille),
        ...rest2
      } = props;
      Vasille.tag("div", {}, Vasille => {
        Vasille.text(VasilleExpr(Vasille, Vasille_0 => Vasille_0.id, [$data]));
        Vasille.text(":");
        Vasille.text($name);
        Vasille.text(" ");
        Vasille.text(VasilleExpr(Vasille, Vasille_0 => Vasille_0.width, [$data]));
        Vasille.text("/");
        Vasille.text(VasilleExpr(Vasille, Vasille_0 => Vasille_0.height, [$data]));
        Vasille.text("...");
        Vasille.text(rest2.$more);
      });
      VasilleSafe(() => console.log($data.V.id, $data.V.width, $data.V.height, $name.V, rest2.$more?.V))();
    }
  }, Vasille);
});
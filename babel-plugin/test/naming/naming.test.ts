import { throwTest } from "../run-test";

it("component not uppercase error", function () {
  throwTest(__dirname, "component-not-uppercase", "The component name must start with a uppercase letter", false, {
    strictFolders: true,
  });
});

it("components folder test", function () {
  throwTest(__dirname, "components-folder", "Components must be placed in a folder named `components`", false, {
    strictFolders: true,
  });
});

it("export filename error", function () {
  throwTest(
    __dirname,
    "export",
    "File name is not correct, expected MyView.ts, MyView.tsx, MyView.js or MyView.jsx",
    false,
    { strictFolders: false },
  );
});

it("modal missing suffix error", function () {
  throwTest(__dirname, "modal-missing-suffix", "The modal component name must end with `Modal`", false, {
    strictFolders: true,
  });
});

it("modal not uppercase error", function () {
  throwTest(__dirname, "modal-not-uppercase", "The modal component name must start with a uppercase letter", false, {
    strictFolders: true,
  });
});

it("modals folder test", function () {
  throwTest(__dirname, "modals-folder", "Modals must be placed in a folder named `modals`", false, {
    strictFolders: { strictFolders: true },
  });
});

it("model missing suffix error", function () {
  throwTest(__dirname, "model-missing-suffix", "The model constructor function name must end with `Model`", false, {
    strictFolders: true,
  });
});

it("model not lowercase error", function () {
  throwTest(
    __dirname,
    "model-not-lowercase",
    "The model constructor function name must start with a lowercase letter",
    false,
    { strictFolders: true },
  );
});

it("models folder test", function () {
  throwTest(__dirname, "models-folder", "Models must be placed in a folder named `models`", false, {
    strictFolders: true,
  });
});

it("page named export error", function () {
  throwTest(__dirname, "page", "Use export default instead", false, { strictFolders: true });
});

it("prompt missing prefix error", function () {
  throwTest(__dirname, "prompt-missing-prefix", "The prompt function name must start with `prompt`", false, {
    strictFolders: true,
  });
});

it("prompts folder test", function () {
  throwTest(__dirname, "prompts-folder", "Prompts must be placed in a folder named `prompts`", false, {
    strictFolders: true,
  });
});

it("store missing suffix error", function () {
  throwTest(__dirname, "store-missing-suffix", "The store name must end with `Store`", false, { strictFolders: true });
});

it("store not lowercase error", function () {
  throwTest(__dirname, "store-not-lowercase", "The store name must start with a lowercase letter", false, {
    strictFolders: true,
  });
});

it("stores folder test", function () {
  throwTest(__dirname, "stores-folder", "Stores must be placed in a folder named `stores`", false, {
    strictFolders: true,
  });
});

it("view missing suffix error", function () {
  throwTest(__dirname, "view-missing-suffix", "The view name must end with `View`", false, { strictFolders: true });
});

it("view not uppercase error", function () {
  throwTest(__dirname, "view-not-uppercase", "The view name must start with a uppercase letter", false, {
    strictFolders: true,
  });
});

it("views folder test", function () {
  throwTest(__dirname, "views-folder", "Views must be placed in a folder named `views`", false, {
    strictFolders: true,
  });
});

it("screen missing suffix error", function () {
  throwTest(__dirname, "screen-missing-suffix", "The screen name must start with `Screen`", false, {
    strictFolders: true,
  });
});

it("screens folder test", function () {
  throwTest(__dirname, "screens-folder", "Screens must be placed in a folder named `screens`", false, {
    strictFolders: true,
  });
});

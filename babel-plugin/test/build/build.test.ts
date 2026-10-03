import { runJsxTest } from "../run-test";

it("SSG test", function () {
  runJsxTest(__dirname, "ssg", {
    replaceWeb: "vasille-ssg",
    headTag: true,
    bodyTag: true,
  });
});

it("SSG no extra tags test", function () {
  runJsxTest(__dirname, "ssg-no-extra-tags", {
    replaceWeb: "vasille-ssg",
    headTag: false,
    bodyTag: false,
  });
});

import { component, effect } from "steel-frame";

const C = component(() => {
    effect(() => {
        console.log("x");
    });
});

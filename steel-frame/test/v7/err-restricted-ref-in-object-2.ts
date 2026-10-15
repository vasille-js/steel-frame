import { ref } from "steel-frame";

let $a = ref({
  [Symbol.iterator]: () => [],
  $b: ref(1),
});

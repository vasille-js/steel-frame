import { compose, beforeMount } from "steel-frame";

interface Props {
    $a: number;
    $b: boolean;
}

const C = compose<Props>(props => {
    function update() {
        props.$b &&= true;
        props.$b = false;
    }

    beforeMount(() => {
        props.$a += 1;
        props.$a = 2;
    });
});

import { state } from "steel-frame";

class C {
    wr$1 = state(9);
    wr$2: number;
    r$3: number;

    public constructor(props: { r$: number }) {
        // this pass
        this.r$3 = props.r$;
        // this fails
        this.wr$2 = props.r$;
    }
}

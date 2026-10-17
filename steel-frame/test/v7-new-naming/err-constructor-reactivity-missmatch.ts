import { state } from "steel-frame";

class C {
    wr_1 = state(9);
    wr_2: number;
    r_3: number;

    public constructor(props: { r_: number }) {
        // this pass
        this.r_3 = props.r_;
        // this fails
        this.wr_2 = props.r_;
    }
}

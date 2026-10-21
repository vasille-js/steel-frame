import { compose } from "steel-frame";

interface Props {
    field: number;
}

type CProps = Props & { c: number };

export const C = compose<CProps>(() => {});

class Amigo {}

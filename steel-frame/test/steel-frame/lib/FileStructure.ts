import { compose, styleSheet } from "steel-frame";

interface Props {
    field: number;
}

type CProps = Props & { c: number };

export const FileStructure = compose<CProps>(() => {});

const helperVar = 1;

function helperFn() {
    return 2;
}

const css = styleSheet({
    div: {
        margin: 10,
    },
});

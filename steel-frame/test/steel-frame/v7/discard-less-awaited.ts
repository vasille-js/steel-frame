import { awaited, compose } from "steel-frame";

function one() {
    return 1;
}

const C = compose(() => {
    const [] = awaited(async () => {
        one();

        do {
            one();
        } while (one());

        for (const i in [0, 1]) {
            one();
        }

        for (const i of [0, 1]) {
            one();
        }

        for (let i = 0; i < 1; i += 1) {
            one();
        }

        let a: number;
        for (a = 3; a < 4; a++) {
            one();
        }

        label: if (one()) {
            one();
        }

        switch (one()) {
            case 1:
                one();
                break;
        }

        try {
            one();
        } catch (e) {
            console.error("error");
        } finally {
            console.log("finally");
        }

        throw one();

        while (one()) {
            one();
        }

        return one();
    });
});

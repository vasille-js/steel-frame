import { calculate, compose } from "steel-frame";

const C = compose(() => {
    let $a = 1;
    const o = { b: 1 };

    const $c = calculate(() => {
        o.b++;

        do {
            $a + 1;
        } while ($a < 1);

        for (const i in [0, 1]) {
            $a + 1;
        }

        for (const i of [0, 1]) {
            $a + 1;
        }

        for (let i = $a; i < $a; i += $a) {
            $a + 1;
        }

        let a: number;
        for (a = 3; a < 4; a++) {
            $a + 1;
        }

        label: if ($a < 3) {
            $a + 1;
        }

        switch ($a) {
            case $a:
                $a + 1;
                break;
        }

        try {
            throw $a;
        } catch (e) {
            $a + 1;
        } finally {
            $a + 1;
        }

        while ($a < 1) {
            $a + 1;
        }

        return 0;
    });
});

import { awaited, compose } from "steel-frame";

async function promise() {
    return new Promise(resolve => resolve(1));
}

const C = compose(() => {
    const [] = awaited(async () => {
        await promise();

        do {
            await promise();
        } while (await promise());

        for (const i in [0, 1]) {
            await promise();
        }

        for (const i of [0, 1]) {
            await promise();
        }

        for await (const i of [0, 1]) {
            console.log(i);
        }

        for (let i = 0; i < 1; i += 1) {
            await promise();
        }

        let a: number;
        for (a = 3; a < 4; a++) {
            await promise();
        }

        label: if (await promise()) {
            await promise();
        }

        switch (await promise()) {
            case 1:
                await promise();
                break;
        }

        try {
            await promise();
        } catch (e) {
            console.error(e);
        } finally {
            console.log("finally");
        }

        while (await promise()) {
            await promise();
        }

        return await promise();
    });
});

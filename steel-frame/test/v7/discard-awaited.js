import { awaited, compose } from "vasille-web";
async function promise() {
  return new Promise(resolve => resolve(1));
}
const C = compose(Vasille => {
  const [] = awaited(async VasilleAbortSignal => {
    await promise();
    VasilleAbortSignal.throwIfAborted()
    do {
      await promise();
      VasilleAbortSignal.throwIfAborted()
    } while ((await promise()) && (VasilleAbortSignal.throwIfAborted() || true));
    for (const i in [0, 1]) {
      await promise();
      VasilleAbortSignal.throwIfAborted()
    }
    for (const i of [0, 1]) {
      await promise();
      VasilleAbortSignal.throwIfAborted()
    }
    for await (const i of [0, 1]) {
      console.log(i);
      VasilleAbortSignal.throwIfAborted();
    }
    for (let i = 0; i < 1; i += 1) {
      await promise();
      VasilleAbortSignal.throwIfAborted()
    }
    let a;
    for (a = 3; a < 4; a++) {
      await promise();
      VasilleAbortSignal.throwIfAborted()
    }
    label: if ((await promise()) && (VasilleAbortSignal.throwIfAborted() || true)) {
      await promise();
      VasilleAbortSignal.throwIfAborted()
    }
    switch (await promise()) {
      case 1:
        await promise();
        VasilleAbortSignal.throwIfAborted()
        break;
    }
    try {
      await promise();
      VasilleAbortSignal.throwIfAborted()
    } catch (e) {
      if (e instanceof AbortError) throw e;
      console.error(e);
    } finally {
      console.log("finally");
    }
    while ((await promise()) && (VasilleAbortSignal.throwIfAborted() || true)) {
      await promise();
      VasilleAbortSignal.throwIfAborted()
    }
    return await promise();
  }, Vasille);
});
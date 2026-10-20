# Compiler hints in Steel Frame v7

## Table of Contents

- [Compiler hints in Steel Frame v7](#compiler-hints-in-steel-frame-v7)
  - [Table of Contents](#table-of-contents)
  - [`state<T>(v: T): T`](#statetv-t-t)
  - [`live<T>(v: T): T`](#livetv-t-t)
  - [`safeState<T>(v: T): T`](#safestatetv-t-t)
  - [`safeLive<T>(v: T): T`](#safelivetv-t-t)
  - [`safeInit<T>(v: T): T`](#safeinittv-t-t)
  - [`effect(fn: () => void): void`](#effectfn---void-void)
  - [`field<T>(v: T): T`](#fieldtv-t-t)
  - [`awaited<T>(fn: (sinal?: AbortSignal) => Promise<T>): [unknown, T|undefined]`](#awaitedtfn-sinal-abortsignal--promiset-unknown-tundefined)
  - [`debounced<T>(v: T, delay: number): T`](#debouncedtv-t-delay-number-t)
  - [`bypassWriteRestriction<T>(writable: T, value: T): T`](#bypasswriterestrictiontwritable-t-value-t-t)

## `state<T>(v: T): T`

`state` returns a writable reactive value, expected reactivity mark is `wr_`.
Use it to create writable states in components.

Example:

```typescript jsx
const C = component(() => {
  let wr_count = state(0);
});
```

## `live<T>(v: T): T`

`live` returns a readonly reactive value which is updated automatically when a dependency changes. The live value is always actual, never stale. Expected reactivity mark is `r_`.

Example:

```typescript jsx
const C = component(() => {
  let wr_count = state(0);
  let r_sum = live(wr_count + 1);
});
```

## `safeState<T>(v: T): T`

`safeState` safely initialize a state, and returns `undefined` if error encounter. In rest same as `state`.

## `safeLive<T>(v: T): T`

`safeLive` safely initialize a live value and returns `undefined` if error encounter. In rest same as `live`.

## `safeInit<T>(v: T): T`

`safeInit` safely initialize a non reactive value and return `undefined` if error encounter.

## `effect(fn: () => void): void`

`effect` run the `fn` funtion each time when any of dependecies are update.
It can not update writable reactive values. Use `live` if one value depends by another.

Example:

```typescript jsx
const C = component(() => {
  let wr_count = state(0);

  effect(() => {
    console.log(wr_count);
  });
});
```

## `field<T>(v: T): T`

`field` extract a field of a writable reactive object as writable reactive value.
When the field value is updated, it will update the entire object.
Expect `wr_` reactivity mark.

Example:

```typescript jsx
const C = component(() => {
  let wr_obj = state({ a: 0 });
  let wr_a = field(wr_obj.a);
});
```

## `awaited<T>(fn: (sinal?: AbortSignal) => Promise<T>): [unknown, T|undefined]`

`awaited` awaits and promise returned by `fn` function. It it contains reactive dependecies, when any of these are updated, the current running function is discarded and a new instance is executed.

Use `signal` to abort the current `fetch`es when a new request is sent.

Example:

```typescript jsx
const C = component(() => {
  let wr_page = state(1);
  let wr_count = state(20);

  const [r_err, r_data] = awaited(async (signal) => {
    // send request again when page or count is updated
    const req = await fetch(`/items/${wr_page}?count=${wr_count}`, { signal });
    return req.json();
  });
});
```

## `debounced<T>(v: T, delay: number): T`

`debounced` debounces the update signal of a reactive value.
It contains a stale value for an interval greater or equal to `delay`ms.
Expect `r_` reactivity mark.

Example:

```typescript jsx
const C = component(() => {
  let wr_searchStr = state("");
  const r_searchFor = debounced(wr_searchStr, 300);

  const [r_err, r_data] = awaited(async (signal) => {
    const req = await fetch(`/items?searchfor=${wr_searchFor}`, { signal });
    return req.json();
  });
});
```

## `bypassWriteRestriction<T>(writable: T, value: T): T`

`bypassWriteRestriction` bypasses the write into writable reastriction inside effects.
The first argument must be a writable reactive value.
Usage of it is not recomanded, but it takes time for Steel Frame to beacome a mature framework which doesn't neet it.

Example:

```typescript jsx
const C = component(() => {
  let wr_count = state(0);
  let wr_synced = state(0);

  effect(() => {
    // update wr_synced each time when wr_count is updated
    bypassWriteRestriction(wr_synced, wr_count);
  });
});
```

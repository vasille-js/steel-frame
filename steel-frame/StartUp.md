# Getting Started with Steel Frame

`SteelFrameKit` is a front-end development kit designed to build **fault-tolerant web applications**. Code is compiled by a Babel plugin: your components are plain functions with JSX, and reactivity is expressed through variable naming conventions — no hooks, no virtual DOM, no asynchronous rendering.

## Table of Content

- [Create a Project](#create-a-project)
- [CLI Commands](#cli-commands)
- [Project Structure](#project-structure)
- [Your First Component](#your-first-component)
- [Reactivity](#reactivity)
- [Conditional Rendering](#conditional-rendering)
- [Loops](#loops)
- [Components, Props & Slots](#components-props--slots)
- [Pages & Routing](#pages--routing)
- [Screens (SPA only)](#screens-spa-only)
- [Models & Stores](#models--stores)
- [Modals & Prompts](#modals--prompts)
- [Styling](#styling)
- [Lifecycle & Effects](#lifecycle--effects)
- [Dependency Injection](#dependency-injection)
- [Fault Tolerance Helpers](#fault-tolerance-helpers)

## Create a Project

The fastest way to start is the official project generator:

```bash
npm create steel-frame
```

It scaffolds a starting project with everything configured. Then:

```bash
cd my-app
npm install
npx web dev
```

If you add Steel Frame to an existing project manually:

```bash
npm install steel-frame --save
```

And configure `tsconfig.json` to use the Steel Frame JSX runtime:

```json
{
    "compilerOptions": {
        "jsx": "preserve",
        "jsxImportSource": "steel-frame",
        "module": "Node16",
        "moduleResolution": "node16",
        "strictNullChecks": true,
        "lib": ["ES2024", "DOM"]
    }
}
```

## CLI Commands

Steel Frame ships a CLI binary named `web`. Running `npx web` without arguments opens an interactive menu.

| Command                | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `web dev`              | Start a hot-reload development server (Vite based)              |
| `web dev+lib`          | Development server for a component library                      |
| `web build spa`        | Build a Single Page Application with the built-in router        |
| `web build html`       | Build a static HTML site (SSG)                                  |
| `web build md`         | Build a static Markdown site (LLM dedicated)                    |
| `web build md+html`    | Build documentation for git (Markdown with inline HTML)         |
| `web build lib`        | Build a component library usable in SPA or SSG                  |
| `web build components` | Build a web components library usable in any frontend framework |

Build output goes to `dist/` (`dist/spa`, `dist/html`, `dist/md`, `dist/lib`, `dist/components`).

## Project Structure

```
my-app/
├── src/
│   ├── pages/          # file-based routes (universal: SPA, SSG, planned SSR)
│   │   ├── index.tsx   # route "/"
│   │   ├── about.tsx   # route "/about"
│   │   └── (id).tsx    # dynamic route "/:id"
│   ├── router/         # optional router customization
│   │   ├── fallbackScreen.tsx
│   │   ├── errorScreen.tsx
│   │   ├── loadingScreen.tsx
│   │   └── loadingOverlay.tsx
│   ├── components/     # components  (name: UpperCase)
│   ├── views/          # views       (name: UpperCase + `View` suffix)
│   ├── screens/        # screens     (name: `Screen` suffix, SPA only)
│   ├── modals/         # modals      (name: UpperCase + `Modal` suffix)
│   ├── prompts/        # prompts     (name: `prompt` prefix)
│   ├── models/         # models      (name: lowercase + `Model` suffix)
│   └── stores/         # stores      (name: lowercase + `Store` suffix)
├── tsconfig.json
└── package.json
```

Naming conventions are enforced at compile time: each entity kind must live in its dedicated folder and respect its naming pattern. The `@` import alias points to `src/`.

## Your First Component

```tsx
import { component, mount } from "steel-frame";

const App = component(() => {
    <p>Hello world</p>;
});

mount(document.body, App, {});
```

No `return` of JSX is needed — JSX statements render in place, synchronously. When a line of code has executed, the DOM is already in sync.

## Reactivity

Reactivity is declared through **name prefixes** (reactivity marks):

| Prefix | Meaning                                       | Declared with           |
| ------ | --------------------------------------------- | ----------------------- |
| `wr_`  | **writable reactive** value (state)           | `let wr_x = ...`        |
| `r_`   | **readonly reactive** value (derived/expression) | `const r_y = wr_x + 1`  |

> The `$` prefix is a legacy mark from older versions. Do not use it in new code.

```tsx
import { component, state, live, field, debounced, effect, unwrap } from "steel-frame";

const Counter = component(() => {
    // writable state: `let` + `wr_` prefix
    let wr_count = 0;              // implicit state
    let wr_other = state(2);       // explicit state constructor

    // readonly derived values: `const` + `r_` prefix
    const r_double = wr_count * 2;         // implicit computed
    const r_label = live(`Count: ${wr_count}`); // explicit computed

    // reactive reference to an object field
    let wr_obj = { a: { b: 1 } };
    const wr_b = field(wr_obj.a.b);

    // debounced readonly projection of a state
    const r_debounced = debounced(wr_count, 100);

    // effect: re-runs when a dependency changes
    effect(() => {
        console.log("count is", wr_count);
    });

    // unwrap() reads the raw value without creating a dependency
    const initial = unwrap(wr_count);

    <div>
        <p>{r_label}</p>
        <button onclick={() => (wr_count += 1)}>+1</button>
    </div>;
});
```

Rules enforced by the compiler:

- Assigning to an `r_` value is forbidden (`Writing to readonly reactive values is forbidden`).
- `const r_ = state(..)` is rejected — a state is writable, so it needs the `wr_` mark.
- `let wr_ = live(..)` or `wr_ = debounced(..)` is rejected — derived values are readonly, so they need the `r_` mark.
- A readonly value cannot be passed where a component expects a writable (`wr_`) prop.
- Inside `effect`, states cannot be written directly (escape hatch: `bypassWriteRestriction`, deprecated — report such cases).

### Reactive Collections

Plain arrays/sets/maps are not implicitly reactive. Use models:

```tsx
import { arrayModel, setModel, mapModel } from "steel-frame";

const items = arrayModel([1, 2, 3]);  // push/splice/... trigger updates
const tags = setModel(["a", "b"]);    // add/delete trigger updates
const dict = mapModel([["k", 1]]);    // set/delete trigger updates
```

### Async Data

```tsx
import { component, awaited, abortSignal } from "steel-frame";

const UserCard = component(() => {
    // awaited: async data in a sync component
    const [r_err, r_user] = awaited(signal => fetch("/api/user", { signal }).then(r => r.json()));

    // abortSignal(): cancels requests/timers when the component is destroyed
    const signal = abortSignal();
});
```

## Conditional Rendering

```tsx
import { component, If, ElseIf, Else } from "steel-frame";

const Status = component((props: { wr_value: number }) => {
    <>
        <If $condition={props.wr_value > 10}>big</If>
        <ElseIf $condition={props.wr_value > 5}>medium</ElseIf>
        <Else>small</Else>

        {/* inline forms are also reactive */}
        {props.wr_value > 0 ? <>positive</> : <>non-positive</>}
        {props.wr_value && <>non-zero</>}
    </>;
});
```

## Loops

```tsx
import { component, For, ArrayView, ArrayModelView, arrayModel } from "steel-frame";

const List = component(() => {
    const items = arrayModel(["a", "b", "c"]);

    <>
        {/* static-ish iteration over array/set/map */}
        <For of={items} slot={value => <li>{value}</li>} />

        {/* reactive array with diff algorithm (keyed) */}
        <ArrayView $of={items} key={v => v} slot={(r_value, r_index) => <li>{r_value}</li>} />

        {/* fine-grained model views */}
        <ArrayModelView of={items} slot={(value, r_index) => <li>{value}</li>} />
    </>;
});
```

Also available: `MapModelView`, `SetModelView`, `Iterate`, `ForEach`, `Watch`, `Delay`, `QueuedRender` (non-blocking rendering queue), and `Zombie` (keeps HTML elements alive for a while after destruction).

## Components, Props & Slots

```tsx
import { component, Slot } from "steel-frame";

interface Props {
    // reactivity marks work in props too:
    wr_value: number;   // writable reactive prop (2-way binding)
    r_label: string;    // readonly reactive prop
    max: number;        // static prop
    slot?: () => void;  // slot
}

const Field = component((props: Props) => {
    <div>
        <span>{props.r_label}</span>
        <input oninput={ev => (props.wr_value = Number(ev.currentTarget.value))} />
        <Slot model={props.slot} />
    </div>;
});

const Form = component(() => {
    let wr_age = 18;
    const r_title = "Age";

    <Field wr_value={wr_age} r_label={r_title} max={100}>
        <small>Required field</small>
    </Field>;
});
```

A component can expose data to its parent via `return` + the `callback` prop:

```tsx
const Exposing = component(() => {
    let wr_x = 1;
    return { wr_x };
});

const Parent = component(() => {
    <Exposing callback={data => console.log(data.wr_x)} />;
});
```

DOM references and lifecycle per element use `callback` on tags (the returned function runs on element destruction):

```tsx
<div
    callback={div => {
        div.style.display = "none";
        return () => (div.style.display = "block");
    }}
/>;
```

## Pages & Routing

**`page` is the universal composition for application pages** — it works with SPA, SSG (static site generation), and planned SSR. It is available starting with v5.

Pages live in `src/pages/` and use file-based routing. Each page file **default-exports** a `page`, and its route type parameter must match the file path:

```tsx
// src/pages/index.tsx  →  route "/"
import { page } from "steel-frame";

export default page<"/">(async props => {
    <h1>Home</h1>;
});
```

```tsx
// src/pages/about.tsx  →  route "/about"
import { page } from "steel-frame";

export default page<"/about">(async props => {
    <h1>About — {props.path}</h1>;
});
```

Dynamic segments use parentheses in the file name:

```tsx
// src/pages/(id).tsx  →  route "/:id"
import { page } from "steel-frame";

export default page<"/(id)">(async ({ params }) => {
    <h1>Item {params.id}</h1>;
});
```

Folders nest routes: `src/pages/blog/(slug).tsx` → `/blog/:slug`. An `index.tsx` inside a folder maps to the folder path itself.

Page props include `path`, `params`, `query`, `url` and `hash` — all strongly typed from the route string.

Navigation is done through the current router:

```tsx
import { component, beforeMount, router } from "steel-frame";

const Nav = component(() => {
    <button onclick={() => router()?.goTo("/about")}>About</button>;
});
```

Router behavior can be customized by placing files in `src/router/`: `fallbackScreen` (not-found / no-access), `errorScreen`, `loadingScreen`, `loadingOverlay`, and `checkAccess` (access levels).

## Screens (SPA only)

**`screen` is compatible with SPA only.** Use it when you build a pure Single Page Application with the programmatic router instead of (or alongside) file-based pages:

```tsx
import { screen, routerApp } from "steel-frame";

const MainScreen = screen<"/">(async props => {
    <h1>Main</h1>;
});

const ItemScreen = screen<"/item/(id)">(async ({ params }) => {
    <h1>Item {params.id}</h1>;
});

routerApp({
    routes: {
        "/": { screen: MainScreen },
        "/item/(id)": { screen: ItemScreen, minAccessLevel: 1 },
    },
    getAccessLevel: async () => 1,
    fallbackScreen: ({ cause }) => {
        <p>{cause === "not-found" ? "404" : "403"}</p>;
    },
});
```

If you target SSG or future SSR, prefer `page` — screens will not be rendered statically.

## Models & Stores

A **model** is a reusable reactive state constructor; a **store** is a singleton state kept in memory:

```tsx
// src/models/counterModel.ts
import { model, createModel, component, beforeMount } from "steel-frame";

export const counterModel = model((props: { start: number }) => {
    let wr_count = props.start;
    return { wr_count };
});

// usage inside a component
const Counter = component(() => {
    const counter = createModel(counterModel, { start: 0 });

    <button onclick={() => (counter.wr_count += 1)}>{counter.wr_count}</button>;
});
```

```tsx
// src/stores/userStore.ts
import { store } from "steel-frame";

export const userStore = store(() => {
    let wr_name = "guest";
    return { wr_name };
});

// anywhere: userStore.wr_name (readonly state view from outside)
```

## Modals & Prompts

```tsx
// src/modals/ConfirmModal.tsx
import { modal } from "steel-frame";

export const ConfirmModal = modal((props: { wr_open: boolean }) => {
    <If $condition={props.wr_open}>
        <div class="overlay">...</div>
    </If>;
});
```

Prompts are modals that resolve a value, shown imperatively:

```tsx
// src/prompts/promptName.tsx
import { prompt, showPrompt, component } from "steel-frame";

export const promptName = prompt<string>(props => {
    <div>
        <input onchange={ev => props.resolve(ev.currentTarget.value)} />
        <button onclick={() => props.reject(new Error("cancelled"))}>Cancel</button>
    </div>;
});

const C = component(() => {
    <button onclick={async () => console.log(await showPrompt(promptName, {}))}>Ask name</button>;
});
```

## Styling

Local stylesheets with themes and responsive helpers:

```tsx
import { styleSheet, dark, light, mobile, tablet, laptop, theme, prefersDark } from "steel-frame";

const styles = styleSheet({
    card: {
        padding: [10, 5],
        display: "block",
        margin: [laptop(40), tablet(20), mobile(10)],
        color: ["#222", dark("#eee")],
        background: [theme("red", "#f00"), theme("blue", "#00f")],
        ":hover": { opacity: 0.8 },
        "@media (max-width: 600px)": { padding: 4 },
    },
});

const Card = component(() => {
    <div class={styles.card}>...</div>;
});
```

Breakpoints are configurable with `setMobileMaxWidth`, `setTabletMaxWidth`, `setLaptopMaxWidth`.

## Lifecycle & Effects

```tsx
import { component, beforeMount, afterMount, beforeDestroy, effect } from "steel-frame";

const C = component(() => {
    beforeMount(() => { /* before DOM mount, may be async */ });
    afterMount(() => { /* after DOM mount, may be async */ });
    beforeDestroy(() => { /* cleanup */ });

    effect(() => { /* re-runs when reactive dependencies change */ });
});
```

## Dependency Injection

Share values down the component tree:

```tsx
import { component, context, share, receive, receiveOptional, impute } from "steel-frame";

const themeCtx = context((name: string) => ({ name }));

const Parent = component(() => {
    share(themeCtx, "dark");    // share a context
    share("api-url", "/api");   // share a setting
    share(MyService, new MyService()); // share a class instance

    <Child />;
});

const Child = component(() => {
    const theme = receive(themeCtx);          // required
    const apiUrl = receiveOptional("api-url"); // optional
    const svc = impute(MyService, () => new MyService()); // create when missing
});
```

## Fault Tolerance Helpers

Errors are contained, not propagated — a failing component does not crash the app:

```tsx
import { setErrorHandler, safe, safeInit, safeState, safeLive } from "steel-frame";

setErrorHandler(e => reportToServer(e));

const C = component(() => {
    const a = safeInit(mayThrow());          // undefined on failure
    const wr_b = safeState(mayThrow());      // undefined state on failure
    const r_c = safeLive(wr_b ?? 0 + mayThrow()); // undefined computed on failure
});
```

JSX attribute and child expressions are automatically made safe by the compiler; errors are reported through the configured handler.

---

**Next steps:**

- Run `npm create steel-frame` and explore the generated project.
- Start the dev server with `npx web dev`.
- Ship with `npx web build spa` or `npx web build html`.

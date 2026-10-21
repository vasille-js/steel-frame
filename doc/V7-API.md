# Steel Frame v7 Framework Documentation

The Steel Frame project aims to create a framework that functions intuitively with just HTML, CSS, and JavaScript -- no special knowledge required.

## Table of Contents

- [Steel Frame v7 Framework Documentation](#steel-frame-v7-framework-documentation)
  - [Table of Contents](#table-of-contents)
  - [Components](#components)
  - [Reactive Assignments](#reactive-assignments)
  - [Reactive Inline Expressions](#reactive-inline-expressions)
  - [Reactive object destruction and field extraction](#reactive-object-destruction-and-field-extraction)
  - [Asynchronous Data](#asynchronous-data)
  - [React to value changes](#react-to-value-changes)
  - [Tags](#tags)
  - [Attributes](#attributes)
  - [Properties](#properties)
  - [Text Expressions](#text-expressions)
  - [Slots](#slots)
  - [Returns](#returns)
  - [Logic Blocks](#logic-blocks)
  - [Loops](#loops)
  - [Watching](#watching)
  - [Styling](#styling)

---

## Components

Components are reusable building blocks in SolidFrame,
written as functions in `.jsx` or `.tsx` files (a superset of JavaScript).

```typescript jsx
export const MyComponent = component(() => {
  // Component logic here
});
```

Props are provided as the first parameter:

```typescript jsx
interface Props {
  foo: number;
}

export const MyComponent = component<Props>((props) => {
  const { foo } = props; // properties object destruction
  console.log(foo); // Direct prop access
});
```

---

## Reactive Assignments

Assignments to local variables with names starting with `wr_`
reactivity mark are reactive.
Changing their value triggers UI updates everywhere they're used.

```typescript jsx
export const MyComponent = component(() => {
  let wr_count = 1;
  function inc() {
    wr_count += 1; // Updates UI reactively
  }
});
```

---

## Reactive Inline Expressions

Inline expressions marked as readonly reactive value
via `r_` reactivity mark are automatically updated.

```typescript jsx
export const MyComponent = component(() => {
  let wr_a = 1;
  let wr_b = 3;
  const r_sum = wr_a + wr_b; // Reactively updates as wr_a or wr_b changes
});
```

---

## Reactive object destruction and field extraction

A writable reactive object can be destructed and its fields extracted:

```typescript jsx
export const MyComponent = component(() => {
  let wr_obj = {
    a: 1,
    b: {
      c: 2,
    },
  };
  // destructure the object
  let { a: wr_a, b: wr_b } = wr_obj;
  // extract the field
  let wr_a1 = wr_obj.a;
  // extracting a field in readonly mode is also possible
  const r_b = wr_obj.b;

  function update() {
    // this line will update the entire object
    wr_a = 2;
  }
});
```

---

## Asynchronous Data

Components can handle asynchronous data using the `awaited` utility.

```typescript jsx
export const MyComponent = component((props) => {
  const { r_id } = props;
  const [r_err, r_data] = awaited(async (abortSignal) => {
    // cancel and resend the request when r_id changes
    const response = await fetch(`https://my.saas/item/${r_id}`, {
      signal: abortSignal,
    });
    return response.json();
  });
  // Variables r_err & r_data are initially undefined and update reactively
});
```

---

## React to value changes

To react to value changes use `effect`:

```typescript jsx
export const MyComponent = component(() => {
  let wr_a = 1;
  let wr_b = 3;

  watch(() => {
    console.log($a, $b); // Runs each time when wr_a or wr_b is updated
  });
});
```

---

## Tags

- Lowercase tags (e.g., `<a>`) are standard HTML elements.
- Capitalized tags indicate components (e.g., `<MyComponent/>`).

```typescript jsx
export const MyApp = component(() => {
  <div>
    <MyComponent />
  </div>;
});
```

---

## Attributes

Attributes closely mirror HTML, supporting JS expressions.

```typescript jsx
export const MyApp = component(() => {
  let wr_path = '/main';
  <a href={wr_path} target="_blank">To Main Page</a>;
});
```

Conditional attributes use booleans:

```typescript jsx
export const MyApp = component(() => {
  let wr_readonly = false;
  <button disabled={wr_readonly}>Submit</button>;
});
```

---

## Properties

Component input values become properties.
Property naming are very important:
a property will be reactive/writable acordly to its reactivity mark.

```typescript jsx
interface Props {
  count: number;
}

const MyComponent = component<Props>((props) => {
  <div>{props.count}</div>;
});

export const MyApp = component(() => {
  <MyComponent count={2} />;
});
```

---

## Text Expressions

Output text within JSX using curly braces:

```typescript jsx
export const MyApp = component(() => {
  let wr_text = 'Main';
  <a href="/main">To {wr_text} Page</a>;
});
```

---

## Slots

Slots allow you to render external content within a component, with optional props and defaults.

```typescript jsx
interface Props {
  slot?: (p: { name: string; count: number }) => void;
}

const MyComponent = component((props: Props) => {
  <div>
    <Slot model={props.slot} name="Name" count={1}>
      Default content
    </Slot>
  </div>
});

export const MyApp = component(() => {
  <MyComponent slot={({ name, count }) => {
    <div>{name}: x{count}</div>
  }} />
});
```

---

## Returns

Components may return values. Use the `callback` attribute to handle return values. Standard `HTML` tags return `HTMLElement` instance.

```typescript jsx
interface InputControl {
  blur(): void;
  focus(): void;
}

const MyComponent = component((): InputControl | null => {
  let input: HTMLInputElement | null = null;

  <input callback={node => input = node} />;
  return input;
});

export const MyApp = component(() => {
  <MyComponent callback={input => input.focus()} />;
});
```

---

## Logic Blocks

There is no special syntax for logic. Predefined components like `<If>`, `<ElseIf>`, and `<Else>` are used instead.

```typescript jsx
export const MyApp = component(() => {
  <>
    <If r_condition={true}>...</If>
    <ElseIf r_condition={false}>...</ElseIf>
    <Else>...</Else>
  </>
});
```

---

## Loops

Use the `ArrayView`, `ArrayModelView`, `MapModelView` and 'SetModelView' component to iterate
arrays, arrray models, set models, or map models:

- `ArrayView` require a reactive value, compare the current array with the previous one to detect changes.
- `ArrayModelView` requires an array model, which is updated by `push`, `pop`, etc.
- `SetModelView` requires a set model, which is updated by `add`, `delete`, `clear`.
- `MapModelView` requires a map model, which is updated by `set`, `delete`, `clear`.

```typescript jsx
import {ArrayView} from "./index";

export const MyApp = component(() => {
    let wr_arr = [1, 2, 3];
    const arr = [1, 2, 3];
    const set = new Set([2, 3]);
    const map = new Map([[1, 2], [2, 3]]);

    <ArrayView r_of={wr_arr} key={item => item} slot={(r_item, r_index) => {
        <div>{r_item}</div>;
    }}/>;
    <ArrayModelView of={arr} slot={(item, r_index) => {
        <div>{item}</div>;
    }} />;
    <SetModelView of={set} slot={item => {
        <div>{item}</div>;
    }}/>;
    <MapModelView of={map} slot={(r_item, key) => {
        <div>{r_item}</div>;
    }}/>;
});
```

---

## Watching

The `<Watch>` component recreates its content whenever the watched model updates.

```typescript jsx
export const MyApp = component(() => {
  let wr_model = 2;
  <Watch r_model={wr_model}>...</Watch>;
});
```

---

## Styling

Use the `styleSheet` function to generate stylesheets at compile time.

```typescript jsx
export const MyComponent = component(() => {
    <div class={css.root}>
        <div class={css.container}>
            Styled text.
        </div>
    </div>;
});

const css = styleSheet({
    root: {
        display: "block",
        // shortcut for 0px
        margin: 0,
        // shortcut for "10px 5px"
        padding: [10, 5],
        // Styles can be declared for any pseudo-selector
        ":hover": {
            margin: 5
        }
    },
    container: {
        // Custom media quesries are supported
        "@media (max-width: 1000px)": {
            margin: 20
        },
        // fallback with custom values for laptops, tablets and phones
        margin: [100, laptop(40), tablet(20), mobile(10)],
        // use same fallback for tablets and phones
        padding: [[50, 45], tablet(mobile([10, 5]))],
        // stylish your application by user requiments
        color: [prefersLight("#fff"), prefersDark("#222")],
        // support dark mode which can be switched from javascript
        background: [light("#fff"), dark("#000")],
        // allLight(..) is light(prefersLight(..)), allDark(..) is dark(prefersDark(..))
        border: [allLight("#000"), allDark("#fff")],
        // suppoert custom themes
        "border-color": [theme("red", "#f00"), theme("green", "#0f0"), theme("blue", "#00f")],
    },
});
```

Apply dynamic styles directly via the `style` attribute (object or string notation):

```typescript jsx
export const MyComponent = component(() => {
  let padding = 10;
  <div style={{ padding: [padding, 'px'] }}>
    <div style={`padding: ${padding}px`}>
      Updated styling.
    </div>
  </div>;
});
```

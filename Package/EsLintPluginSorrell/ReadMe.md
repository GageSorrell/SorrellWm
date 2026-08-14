*Copyright &copy; 2026 Gage Sorrell.  Released under the [MIT license](./License.md).*

# `@sorrell/eslint-plugin`

The [ESLint](https://eslint.org/) plugin used by [`SorrellWm`](https://github.com/GageSorrell/SorrellWm) *et al.*

It provides these rules:

* [`jsdoc-file-name`](#jsdoc-file-name)
* [`jsdoc-module-name-package`](#jsdoc-module-name-package)
* [`react-displayname`](#react-displayname)

## Installation

The plugin ships as TypeScript and is compiled to `./Distribution` before use.

```sh
npm run build --workspace Package/EsLintPluginSorrell
```

`eslint` (`^9.39.4`) is a peer dependency.

## Usage

Register the plugin under the `@sorrell` namespace in your flat config and turn
the rules on.  None are enabled by default, so nothing happens until you opt in.

```js
import Sorrell from "@sorrell/eslint-plugin";

export default [
    {
        files: [ "**/*.{js,ts,tsx}" ],
        plugins:
        {
            "@sorrell": Sorrell
        },
        rules:
        {
            "@sorrell/jsdoc-file-name": "error",
            "@sorrell/jsdoc-module-name-package": "error",
            "@sorrell/react-displayname": "error"
        }
    }
];
```

## `jsdoc-file-name`

Ensures that, when a module documents itself with a JSDoc `@file` tag, the tag's
value matches the name of the file that contains it.

A module with no `@file` tag is left alone &mdash; the rule only checks the tag
when it is present.

The rule is **fixable**: running ESLint with `--fix` rewrites the tag's value to
the correct file name.

### Examples

Given a file named `Widget.ts`:

```ts
/* Incorrect — the tag value does not match the file name. */
/**
 * @file Gadget.ts
 */

/* Correct. */
/**
 * @file Widget.ts
 */
```

## `jsdoc-module-name-package`

Ensures that, when a module documents itself with a JSDoc `@module` tag, the
tag's value either equals the `"name"` of the nearest `package.json` or begins
with that name followed by `/` (a sub-path within the package).

A module with no `@module` tag &mdash; or one that resolves to no named
`package.json` &mdash; is left alone.

This rule is not fixable: the intended sub-path cannot be inferred, so mismatches
are reported for the author to correct.

### Examples

For a file in the package named `@sorrell/eslint-plugin`:

```ts
/* Incorrect — does not begin with the package name. */
/**
 * @module @sorrell/other/Rules/Widget
 */

/* Correct — exactly the package name. */
/**
 * @module @sorrell/eslint-plugin
 */

/* Correct — a sub-path within the package. */
/**
 * @module @sorrell/eslint-plugin/Rules/Widget
 */
```

## `react-displayname`

Requires a React functional component to set its `displayName` property via a
module-level `Widget.displayName = ...;` statement.

### What counts as a component

A declaration is treated as a likely component when its name is PascalCase
(starts with an uppercase letter) **and** it is one of:

* a top-level `function` declaration whose body returns JSX from at least one
  code path;
* a top-level `const` bound to an arrow function or function expression whose
  body returns JSX from at least one code path;
* either of the above wrapped in `forwardRef` and/or `memo` (bare or
  `React.`-qualified, and nestable, e.g. `memo(forwardRef(...))`).

`export` and `export default` are unwrapped first, so exported components are
recognized the same as unexported ones.  A `let`- or `var`-bound function, a
lowercase-named function, and a function that never returns JSX are all left
alone, whether or not they set a `displayName`.

### Options

This rule takes an optional options object:

```ts
{
    "follows-immediately"?: boolean; // default: true
    matchExact?: boolean;            // default: false
}
```

* **`matchExact`** &mdash; when `true`, the `displayName` value must be a
  string literal identical to the component's name (an `as const` assertion
  on that literal is also accepted).  When `false` (the default), any
  `displayName` assignment satisfies the rule, regardless of its value.
* **`follows-immediately`** &mdash; when `true` (the default), the
  `displayName` assignment must be the statement that immediately follows the
  component's definition at the module's top level (blank lines and comments
  do not count as statements in between).  When `false`, the assignment may
  appear anywhere at the module's top level.

### Examples

With the default options:

```tsx
/* Incorrect — no displayName assignment at all. */
function Widget() {
    return <div />;
}

/* Correct. */
function Widget() {
    return <div />;
}
Widget.displayName = "Widget";
```

With `{ "follows-immediately": false }`:

```tsx
/* Correct — the assignment need not be adjacent. */
function Widget() {
    return <div />;
}
const Styles = makeStyles();
Widget.displayName = "Widget";
```

With `{ matchExact: true }`:

```tsx
/* Incorrect — the value does not match the component's name. */
Widget.displayName = "NotWidget";

/* Correct. */
Widget.displayName = "Widget";

/* Also correct — `as const` is allowed, not required. */
Widget.displayName = "Widget" as const;
```

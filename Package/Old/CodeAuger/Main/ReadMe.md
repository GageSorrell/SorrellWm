*Copyright &copy; 2026 Gage Sorrell.  Released under the [MIT license](./License.md).*

# `code-auger`

**Purpose.**&ensp;A lightweight CLI tool for adding auto-generated code to your dependents (likewise, from your dependencies).

## Usage

### With dependencies that support `code-auger`

If a dependency of your package supports `code-auger`, then to use its code-generating features, first install the `code-auger` CLI,

```bash
npm init code-auger
```

This will add `code-auger` as a `devDependency`, and will create a default `code-auger.config.ts` in the root of your package.

To see what dependencies support `code-auger`, run the `ls` command,

```bash
npx code-auger ls
```

All dependencies currently installed that support `code-auger` will have basic entries in the `code-auger-config.ts` file when it is created.

To make supported dependencies write their auto-generated code to your package, simply run the `code-auger` command (via `npx` or an `npm` script),

```jsonc
    "scripts": {
        "prebuild": "code-auger",
        // ...
    }
```

The `init` command above adds the above `prebuild` script in your `package.json` (if your `package.json` has a `build` script and no pre-existing `prebuild` script).

The `--pkg` flag allows you to limit which packages generate code when `code-auger` is run.  For example,

```jsonc
    "scripts": {
        "prebuild": "code-auger --pkg reactive-event",
        // ...
    }
```

will cause only the `reactive-event` dependency to generate code for your package.

To limit which modules a given package generates, use the `--pkg` flag followed by *exactly one package* (you may use the `--pkg` flag multiple times in the same command), then specify the modules that you want that dependency to generate for you with the `--module` flag (delimited by a space).
For example,

```jsonc
    "scripts": {
        "prebuild": "code-auger --pkg reactive-event --module registrar preload",
        // ...
    }
```

> [!TIP]
> The `ls` command mention earlier will also state the names of the modules that it can generate for you, if the package can generate more than one module.

### Add code-generation support to your package

To offer code-generation abilities to your users via `code-auger`, install `code-auger` like in the previous subsection, but with the `--author` flag *(please note the `--` before the flag),*

```bash
npm init code-auger -- --author
```

This will add `code-auger` as a `devDependency` to your package, and will generate a `code-auger.author.config.ts` to the root of your package.

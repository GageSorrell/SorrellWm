*&copy; 2026 Gage Sorrell.  Released under the [MIT license](./License.md).*

# `reactive-event`

*Type-safe Electron IPC functions, including modern React hooks.*

## Features

* Events as types (["event *declarations*"](https://reactive-event.sorrell.sh/1.0.0/articles/glossary))
* Effortless transition for `main` (just `import { ipcMain } from "reactive-event"`)
* Typed React hooks with simple setup (as little as one line in your `preload`)
    * Also supports `<Suspense>` and transitions!
* Register your types with almost no boilerplate, or write *no boilerplate* with [`reactive-event-cli`](https://github.com/GageSorrell/ReactiveEventCli#ReadMe) or [the VS Code extension](https://github.com/GageSorrell/ReactiveEventCodeExtension#ReadMe)

## Installation

Simply add `reactive-event` as a normal dependency,

```bash
npm install reactive-event
```

**Recommended.**&ensp;Consider installing the CLI utility, [`reactive-event-cli`](https://github.com/GageSorrell/ReactiveEventCli#ReadMe) to write the boilerplate for you,

```bash
npx init reactive-event
```

This will install the CLI, and launch the interactive `setup` wizard.

> [!NOTE]
> See [the CLI introduction article](https://reactive-event.sorrell.sh/1.0.0/cli/introduction) to learn more about using the CLI.

> [!TIP]
> VS Code users can use [the Reactive Event extension](https://github.com/GageSorrell/ReactiveEventCodeExtension), which runs the CLI for you automatically when needed.

## Documentation

The [documentation is available here](https://reactive-event.sorrell.sh/1.0.0/articles/introduction).  It features [articles](https://reactive-event.sorrell.sh/1.0.0/articles/), [guides](https://reactive-event.sorrell.sh/1.0.0/guides/), [examples](https://reactive-event.sorrell.sh/1.0.0/examples/snippets) (including a [sample project](https://reactive-event.sorrell.sh/1.0.0/examples/sample-project)), and a thorough [reference](https://reactive-event.sorrell.sh/1.0.0/reference/).

## Development

### Prerequisites

| Package | Version |
|--------:|:--------|
| NodeJS  | `>=24`  |
| `npm`   | `>=11`  |

### Instructions

To extend `reactive-event`, simply clone the repo and install dependencies,

```bash
git clone https://github.com/GageSorrell/ReactiveEvent
cd ReactiveEvent
npm install
```

It is recommended to use the included sample project for prototyping,

```bash
cd Sample # From the root of the project
npm install
npm run start
```

and simply [override](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) the `reactive-event` dependency with your local copy.

## Showcase

* [SorrellWm](https://github.com/GageSorrell/SorrellWm): *The tiling window manager for everyone.* (The original motivation of this package!)

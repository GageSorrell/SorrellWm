*&copy; 2026 Gage Sorrell.  Released under the [MIT license](./License.md).*

# `electron-reactive-event`

*Type-safe Electron IPC functions, including modern React hooks.*

## Features

* Events as types (["event *declarations*"](https://electron-reactive-event.sorrell.sh/1.0.0/articles/glossary))
* Effortless transition for `main` (just `import { ipcMain } from "electron-reactive-event"`)
* Typed React hooks with simple setup (as little as one line in your `preload`)
    * Also supports `<Suspense>` and transitions!
* Register your types with almost no boilerplate, or write *no boilerplate* with [`electron-reactive-event-cli`](https://github.com/GageSorrell/ElectronReactiveEventCli#ReadMe) or [the VS Code extension](https://github.com/GageSorrell/ElectronReactiveEventCodeExtension#ReadMe)

## Installation

Simply add `electron-reactive-event` as a normal dependency,

```bash
npm install electron-reactive-event
```

**Recommended.**&ensp;Consider installing the CLI utility, [`electron-reactive-event-cli`](https://github.com/GageSorrell/ElectronReactiveEventCli#ReadMe) to write the boilerplate for you,

```bash
npx init electron-reactive-event
```

This will install the CLI, and launch the interactive `setup` wizard.

> [!NOTE]
> See [the CLI introduction article](https://electron-reactive-event.sorrell.sh/1.0.0/cli/introduction) to learn more about using the CLI.

> [!TIP]
> VS Code users can use [the Electron Reactive Event extension](https://github.com/GageSorrell/ElectronReactiveEventCodeExtension), which runs the CLI for you automatically when needed.

## Documentation

The [documentation is available here](https://electron-reactive-event.sorrell.sh/1.0.0/articles/introduction).  It features [articles](https://electron-reactive-event.sorrell.sh/1.0.0/articles/), [guides](https://electron-reactive-event.sorrell.sh/1.0.0/guides/), [examples](https://electron-reactive-event.sorrell.sh/1.0.0/examples/snippets) (including a [sample project](https://electron-reactive-event.sorrell.sh/1.0.0/examples/sample-project)), and a thorough [reference](https://electron-reactive-event.sorrell.sh/1.0.0/reference/).

## Development

### Prerequisites

| Package | Version |
|--------:|:--------|
| NodeJS  | `>=24`  |
| `npm`   | `>=11`  |

### Instructions

To extend `electron-reactive-event`, simply clone the repo and install dependencies,

```bash
git clone https://github.com/GageSorrell/ElectronReactiveEvent
cd ElectronReactiveEvent
npm install
```

It is recommended to use the included sample project for prototyping,

```bash
cd Sample # From the root of the project
npm install
npm run start
```

and simply [override](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) the `electron-reactive-event` dependency with your local copy.

## Showcase

* [SorrellWm](https://github.com/GageSorrell/SorrellWm): *The tiling window manager for everyone.* (The original motivation of this package!)

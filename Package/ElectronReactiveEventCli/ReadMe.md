*Copyright &copy; 2026 Gage Sorrell.  Released under the [MIT license](./License.md).*

# `electron-reactive-event-cli`

**Purpose.**&ensp;This CLI provides the build step for [`electron-reactive-event`](https://www.npmjs.com/package/electron-reactive-event).
It also supports CI/CD pipelines with a "silent" mode.

> [!TIP]
> VS Code users can use [the Electron Reactive Event extension](https://github.com/GageSorrell/ElectronReactiveEventCodeExtension), which runs the CLI for you automatically when needed.

## Installation

Ensure that `electron-reactive-event` is installed,

```bash
npm install electron-reactive-event
```

From here, there are two options,

1. *(Recommended)* Run the `init` command, which adds the CLI globally *and* launches the `setup` wizard for you,

```bash
npx init electron-reactive-event
```

2. Add the CLI as a `devDependency` (or globally), then run the `setup` command,

```bash
npm install --save-dev electron-reactive-event-cli
npm exec -- electron-reactive-event-cli setup

# Or, globally,
npm install -g electron-reactive-event-cli
electron-reactive-event-cli setup
```

## Documentation

The [documentation is available here](https://electron-reactive-event.sorrell.sh/1.0.0/cli/introduction), within [the documentation for `electron-reactive-event`](https://electron-reactive-event.sorrell.sh/1.0.0/articles/introduction).

Also see the [Electron Reactive Event extension](https://github.com/GageSorrell/ElectronReactiveEventCodeExtension) for VS Code, which runs the CLI for you upon saving files.

For more details about [`electron-reactive-event`, please see the GitHub repo here](https://github.com/GageSorrell/ElectronReactiveEvent).

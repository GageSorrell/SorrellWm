*Copyright &copy; 2026 Gage Sorrell.  Released under the [MIT license](./License.md).*

# `reactive-event-cli`

**Purpose.**&ensp;This CLI provides the build step for [`reactive-event`](https://www.npmjs.com/package/reactive-event).
It also supports CI/CD pipelines with a "silent" mode.

> [!TIP]
> VS Code users can use [the Reactive Event extension](https://github.com/GageSorrell/ReactiveEventCodeExtension), which runs the CLI for you automatically when needed.

## Installation

Ensure that `reactive-event` is installed,

```bash
npm install reactive-event
```

From here, there are two options,

1. *(Recommended)* Run the `init` command, which adds the CLI globally *and* launches the `setup` wizard for you,

```bash
npx init reactive-event
```

2. Add the CLI as a `devDependency` (or globally), then run the `setup` command,

```bash
npm install --save-dev reactive-event-cli
npm exec -- reactive-event-cli setup

# Or, globally,
npm install -g reactive-event-cli
reactive-event-cli setup
```

## Documentation

The [documentation is available here](https://reactive-event.sorrell.sh/1.0.0/cli/introduction), within [the documentation for `reactive-event`](https://reactive-event.sorrell.sh/1.0.0/articles/introduction).

Also see the [Reactive Event extension](https://github.com/GageSorrell/ReactiveEventCodeExtension) for VS Code, which runs the CLI for you upon saving files.

For more details about [`reactive-event`, please see the GitHub repo here](https://github.com/GageSorrell/ReactiveEvent).

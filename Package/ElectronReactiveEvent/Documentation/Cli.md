> <span style="font-size: 12px;">Documentation for `electron-reactive-event`.<br />(c) 2026 Gage Sorrell.  Provided under the [MIT License](../License.md).</span>

# `electron-reactive-event-cli`

**Purpose.**&ensp;This article describes the helper package `electron-reactive-event-cli`.
Using this package is optional, but it will write all the basic boilerplate code needed to set up your project to use `electron-reactive-event`.
An additional command is provided to help register your event types as you define events throughout the development of your project.

For a thorough explanation of *what* boilerplate is needed, *why* it is needed, and *how* you can customize it, see [the Setup article](./Setup.md).

> [!NOTE] *"Why is (almost) every feature exposed via a factory function, and not exported directly?"*
>
> This is done to make type definitions less intrusive: you provide
> to these factory functions your `IMainRegistrar` and `IRendererRegistrar` types, and all returned functions will be type-aware for your app's events.

## Commands

There are three commands: one for `setup`, one to `register` event declarations as you create them throughout development, and a `help` command.

### Motivation

The consuming package needs to define two empty interface types: one that will contain `main` event declarations, and one that will contain `renderer` event declarations.
These interfaces are extended via `declare module`, in which properties are added to these interfaces.
The names of these properties become the event channels, and their values are the corresponding event declaration types.

### Purpose

The `setup` command creates a settings file that stores the names and locations of these interface types.

The `register` command generates the `declare module` blocks in the modules containing event declarations, using the settings file created during `setup`.

### The `setup` Command

Running `npx electron-reactive-event-cli setup` launches an interactive wizard, in which the user is prompted to create a module (or two) in which they define the interfaces ("registrars") for `main` and `renderer` event declarations.

The user provides the paths to the module(s), and selects the interfaces from a list of exported interfaces in the selected module(s).

Once this information is provided, the user may choose a path for the CLI to write a JSON file containing this information, to be used later by the `register` command.

If the default path (`./electron-reactive-event.json`) is not used, then a property `electron-reactive-event-cli` is added under the `package.json`'s `config` property, which contains the given path.

The user is also asked if they would like to have a script added to their `package.json` to call the `register` command more ergonomically.
It is recommended to let the wizard create this script, and to modify any `build` or `prestart` scripts to call this script within them.

### The `register` Command

The `declare module` blocks needed to register event declaration types are straightforward to write, but doing so is tedious.
The `register` command addresses this by finding your event declaration types, and creates or modifies existing `declare module` blocks in the modules containing your event declarations.

For the CLI to create these `declare module` blocks, the [ownership](./Glossary.md#ownership) must be specified within the event declaration, via the last type parameter in the generic `EventDecl` type.

> [!NOTE]
> If you do not use this script as a part of your build process, then this argument can always be left unspecified.

#### Flags

##### `--silent`&ensp;(`-s`)&ensp;*(Optional)*

If event declarations are found with no ownership specified, then the CLI will assume that this is unintentional, and a warning will be written to `stdout`.
Since the `register` command is intended to be used in any `build` or `prestart` scripts, it is expected that extraneous use of `stdout` could cause issues with automated build tools.

If this is the case for your project, add the `--silent` flag to the script in your `package.json` that calls the CLI's `register` command, so that these warnings will *not* be written to `stdout`.

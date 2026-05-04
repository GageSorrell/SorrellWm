---
prev: false
---
[reactive-event](/docs) / [CLI](./index.md) / Introduction

# Introduction to the CLI

::: tip Purpose
This article describes the helper package `reactive-event-cli`.
Using this package is optional, and automates writing boilerplate code needed to register your [event declarations](../articles/glossary.md#event-declaration) with your [registrar interfaces](../articles/glossary.md#registrar).
:::

<div class="CustomTocContainer">
<p class="CustomTocTitle">In this article</p>

[[toc]]

</div>

## Motivation

It is expected that most developers will want their event declarations to live alongside logic corresponding to these events, *i.e.*, *not* in a single module that pulls in types from modules scattered throughout their codebase.

Event declarations are grouped by registrar interfaces, and these registrar interfaces are what the developer passes to the factories provided by this package.

The issue presented by the above is that defining event declarations should be *decentralized* (in most cases), but a *central* definition (*i.e.*, registrar interfaces) is required for `reactive-event` to ingest them.

Fortunately, TypeScript allows for interfaces to be extended via [module augmentation <FluentIcon Icon="ExternalLink" />](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).
This feature allows for the registrar interfaces in your project to be supplemented with your event declarations, regardless of where they are in your project.

However, `declare module` blocks are lengthy, and are tedious to write for *every* module in which an event declaration is defined.

To address this, a CLI package `reactive-event-cli` was created, which writes these `declare module` blocks for you.
They are written to a single module, which can exist anywhere in your project that is recognized by your project's [TSConfig's `include` property&nbsp;<FluentIcon Small Icon="ExternalLink"/>](https://www.typescriptlang.org/tsconfig/#include).

## Getting Started

Follow the steps in the [Project Setup](./project-setup.md) article to perform the minimum setup needed to run the interactive wizard provided by the `setup` command.

If your project already uses `reactive-event`, then you have likely done everything in the [Project Setup](./project-setup.md) article.
If this is the case, then you may skip ahead to the [`setup` Command](./setup.md) article.

The interactive wizard provided by the `setup` command will notify you if a prerequisite step has not been completed.

## References

[TypeScript: Documentation - Declaration Merging <FluentIcon Icon="ExternalLink" />](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)

[TypeScript: TSConfig Reference - Docs on every TSConfig option § Include - `include`&nbsp;<FluentIcon Small Icon="ExternalLink"/>](https://www.typescriptlang.org/tsconfig/#include)

<!-- ## Commands

There are three commands: one for `setup`, one to `register` event declarations as you create them throughout development, and a `help` command.

### Motivation

The consuming package needs to define two empty interface types: one that will contain `main` event declarations, and one that will contain `renderer` event declarations.
These interfaces are extended via `declare module`, in which properties are added to these interfaces.
The names of these properties become the event channels, and their values are the corresponding event declaration types.

### Purpose

The `setup` command creates a settings file that stores the names and locations of these interface types.

The `register` command generates the `declare module` blocks in the modules containing event declarations, using the settings file created during `setup`.

### The `setup` Command

Running `npx reactive-event-cli setup` launches an interactive wizard, in which the user is prompted to create a module (or two) in which they define the interfaces ("registrars") for `main` and `renderer` event declarations.

The user provides the paths to the module(s), and selects the interfaces from a list of exported interfaces in the selected module(s).

Once this information is provided, the user may choose a path for the CLI to write a JSON file containing this information, to be used later by the `register` command.

If the default path (`./reactive-event.json`) is not used, then a property `reactive-event-cli` is added under the `package.json`'s `config` property, which contains the given path.

The user is also asked if they would like to have a script added to their `package.json` to call the `register` command more ergonomically.
It is recommended to let the wizard create this script, and to modify any `build` or `prestart` scripts to call this script within them.

### The `register` Command

The `declare module` blocks needed to register event declaration types are straightforward to write, but doing so is tedious.
The `register` command addresses this by finding your event declaration types, and creates or modifies existing `declare module` blocks in the modules containing your event declarations.

For the CLI to create these `declare module` blocks, the [ownership](./Glossary.md#ownership) must be specified within the event declaration, via the last type parameter in the generic `EventDecl` type.

#### Flags

<br />

##### `--silent`&ensp;(`-s`)&ensp;*(Optional)*

If event declarations are found with no ownership specified, then the CLI will assume that this is unintentional, and a warning will be written to `stdout`.
Since the `register` command is intended to be used in any `build` or `prestart` scripts, it is expected that extraneous use of `stdout` could cause issues with automated build tools.

If this is the case for your project, add the `--silent` flag to the script in your `package.json` that calls the CLI's `register` command, so that these warnings will *not* be written to `stdout`.

::: info
If you do not use this script as a part of your build process, then this argument can always be left unspecified.
::: -->

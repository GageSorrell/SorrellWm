---
next: false
---
[reactive-event](/docs) / [Examples](./) / Sample Project

# Sample Project

::: tip Purpose
A sample project is presented herein, which demonstrates each feature provided by `reactive-event`.
The project is also configured to use the [CLI](../cli/introduction).
:::

<div class="CustomTocContainer">
<p class="CustomTocTitle">In this article</p>

[[toc]]

</div>

A sample project is provided for demonstration.
This project was used throughout development, and showcases each feature&mdash;that is, every overload of every function is used at least once, using nontrivial event declarations.

## How to Run the Sample

The sample project is hosted in the [SorrellWm](https://wm.sorrell.sh) monorepo (as are `reactive-event` and `reactive-event-cli`).
This monorepo structure precludes the use of tools like `degit` as an easy way to download the sample project.

### Download via the CLI

To make this process easier, the CLI provides a command to download the sample project,

```bash
npx reactive-event-cli download-sample
```

This command will download the project in the working directory, at path `./reactive-event-sample`.

From there,

```bash
cd reactive-event-sample
npm install
npm run start
```

<div class="TipContainer">

::: info <FluentIcon Icon="Lightbulb"/> Tip:&ensp;The `--run` flag.
Run the above CLI command with the `--run` flag to download the project *and* run the above three commands.

That is, use

```bash
npx reactive-event-cli download-sample --run
```
for a fully automated process.
:::

</div>

### Download Manually

Understandably, some may not want to use an unfamiliar `npm` script to download and run a project for them.
The sample project may be downloaded by cloning the SorrellWm monorepo,

```bash
git clone https://github.com/GageSorrell/SorrellWm
```

The remaining steps are nearly identical to the above,

```bash
cd SorrellWm/Development/ReactiveEventSample
npm install
npm run start
```

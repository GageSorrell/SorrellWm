[electron-reactive-event](../introduction.md) / [CLI](./) / Getting Started

# Project Setup

::: tip Purpose
This article describes how to set up your project to use the `electron-reactive-event-cli`.
It is assumed in this guide that you have already completed the steps detailed in the *main* [Project Setup](../project-setup.md) article.
:::

<div class="CustomTocContainer">
<p class="CustomTocTitle">In this article</p>

[[toc]]

</div>


## 0. *(Optional)* Install the CLI

This article provides `npx` commands for using the CLI.
The `npx` command will look for the given package in the local `node_modules` in the project in which the CWD exists.
If the package is not installed locally, it will check whether the package is installed globally (and prompts to install the package globally if it is not found).

Depending upon your environment, you may wish to keep the CLI installed locally.
If this is the case, then installation should be done before proceeding,

```bash
npm install --save-dev electron-reactive-event-cli
```

## 1. Define Registrars

Your project must have at least two registrars:

## References

[npx | npm Docs § Description <FluentIcon Icon="ExternalLink" />](https://docs.npmjs.com/cli/v11/commands/npx#description)



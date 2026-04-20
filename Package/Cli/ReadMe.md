# `@sorrell/cli`

**Purpose.**&ensp;This package contains general-purpose scripts for NodeJS development.

```bash
npx @sorrell/cli help
```

> [!TIP]
> For utilities to use in your own scripts, use [`@sorrell/cli-utilities`](../CliUtilities/ReadMe.md), of which this package makes extensive use.

## Documentation

Summaries of the scripts provided by this package are given below, but full documentation is available at [https://cli.sorrell.sh](https://cli.sorrell.sh).

## Scripts

### `publish`

**Purpose.**&ensp;Runs `npm publish --access public` for the package of the `process.cwd()`.
If the version conflicts with what is already published, then it will run `npm version patch` first.
This script will run `npm login` if you are not logged into an account with permission to publish the given package.
If either of these commands prompt the user to open a link in the browser, then it will

#### Usage

In any directory within a given `npm` package,
```bash
npx @sorrell/utilities publish
```

#### Options

##### `--silent` (`-s`),&ensp;*boolean*

*(Optional)*.&ensp;If specified, then the links given to the script from `npm login` and `npm publish` will *not* be opened in the default browser; instead, the script will fail if such a link is needed to continue with publishing the given package.

## Global Options

All commands accept the following options.
A given command might perform behavior *in addition to* what is described below.

### `--silent` (`-s`),&ensp;*boolean*

*(Optional)*.&ensp;If specified, then nothing will be output to the terminal.
The script will exit with `exitCode === 0` if successful, otherwise it will exit with `exitCode === 1`.

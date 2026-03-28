<span style="font-size: 12px;">Documentation for `SorrellWm`.<br />(c) 2026 Gage Sorrell.  Provided under the [MIT License](../License.md).</span>

# Documentation

> [!IMPORTANT]
> You are likely looking for [the documentation for `SorrellWm`.  The documentation website is available here](https://wm.sorrell.sh); this directory holds the *source* for the documentation website.
>
> Since the documentation content is written in GitHub-Flavored Markdown, you *can* read the source on GitHub or in your IDE, but the [website](https://wm.sorrell.sh) (built with `vitepress`) has several added niceties.

## `411`

[The documentation website](https://wm.sorrell.sh) contains the documentation for `SorrellWm`.
The documentation for other packages is in its own location respectively.

The following table lists all packages in the monorepo that have documentation (or have documentation that is in the process of being written),

| Package | Description | Documentation |
| ---: | :--- | :---: |
| `electron-reactive-event` | Type-aware event handling for apps built with `electron` and `react`. | `@TODO`&nbsp;&nbsp;([`ReadMe.md`](../Package/ElectronReactiveEvent/ReadMe.md)) |
| `electron-reactive-event-cli` | CLI utility for automating development of projects using [`electron-reactive-event`](../Package/ElectronReactiveEvent/ReadMe.md). | `@TODO`&nbsp;&nbsp;([`ReadMe.md`](../Package/ElectronReactiveEventCli/ReadMe.md)) |
| `@sorrell/win-32` | Exposes the [Windows API](https://learn.microsoft.com/en-us/windows/win32/apiindex/windows-api-list) to `SorrellWm` and contains all other native functionality for `SorrellWm`. | `@TODO`&nbsp;&nbsp;([`ReadMe.md`](../Package/OraSpinnerDemo/ReadMe.md)) |
| `@sorrell/utilities` | General-purpose utilities for runtime and development. | `@TODO`&nbsp;&nbsp;([`ReadMe.md`](../Package/Utilities/ReadMe.md)) |
| `@sorrell/cli-utilities` | Utilities for CLI applications (terminal-based user interfaces). | `@TODO`&nbsp;&nbsp;([`ReadMe.md`](../Package/CliUtilities/ReadMe.md)) |

### Packages without Documentation

The following table lists all packages in the monorepo that do not have documentation, and for which there is no intent to write documentation,

| Package | Description | `ReadMe.md` |
| ---: | :--- | :---: |
| <code>electron&#8209;reactive&#8209;event&#8209;test</code> | The project used to test and develop [<code>electron&#8209;reactive&#8209;event</code>](../Package/ElectronReactiveEvent/ReadMe.md) (and [<code>electron&#8209;reactive&#8209;event&#8209;cli</code>](../Package/ElectronReactiveEventCli/ReadMe.md)). | [`ReadMe.md`](../Development/ElectronReactiveEventTest/README.md) |
| `build` | The package that builds `SorrellWm`. | [`ReadMe.md`](../Script/Build/ReadMe.md) |
| `clean-repo` | Deletes all `node_modules` directories and `*.tsbuildinfo` files in the monorepo. | [`ReadMe.md`](../Script/CleanRepo/ReadMe.md) |
| `ora-spinner-demo` | View all spinners offered by [`ora`](https://www.npmjs.com/package/ora) with an interactive, paginated UI. | [`ReadMe.md`](../Package/OraSpinnerDemo/ReadMe.md) |
| `@sorrell/inquirer-file-selector` | A fork of [`inquirer-file-selector`](https://www.npmjs.com/package/inquirer-file-selector) which prevents navigating above the given `basePath`. | [`ReadMe.md`](../Package/InquirerFileSelector/ReadMe.md) |
| `script-utility` | Utilities for the packages in the `Script` directory.  This will likely be merged into [`@sorrell/utilities`](../Package/Utilities/ReadMe.md) and [`@sorrell/cli-utilities`](../Package/CliUtilities/ReadMe.md) in the future. | [`ReadMe.md`](../Package/ScriptUtility/ReadMe.md) |
| `KillElectronInstances.ps1` | A small script that kills all instances of `electron`.  Useful for debugging crashes that leave an `electron.exe` process running.  This is accessed through the `npm` script `kill-electron` in `@sorrell/wm`. | [`ReadMe.md`](../Script/KillElectronInstances/ReadMe.md) |

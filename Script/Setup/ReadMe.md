# `@sorrell/wm-monorepo-setup`

Local setup automation for a freshly cloned SorrellWm monorepo.

Run all setup features:

```powershell
npm start -w @sorrell/wm-monorepo-setup
```

Install and enable the SorrellWm VS Code extension:

```powershell
npm start -w @sorrell/wm-monorepo-setup -- extension
```

Uninstall the extension locally:

```powershell
npm start -w @sorrell/wm-monorepo-setup -- extension false
```

Completed setup runs are skipped. Use `--force` to run a command again, or use
the `clear` subcommand to delete `Configuration/Local.json` and reset setup
state.

The root package invokes this command with `--postinstall`. On first install it
prompts before running setup, remains quiet while operations run, and leaves
`HasRun` false when setup is declined. Non-interactive postinstall environments
skip setup so dependency installation cannot hang waiting for input.

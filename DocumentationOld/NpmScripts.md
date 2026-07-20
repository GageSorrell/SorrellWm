# NPM Scripts

*This is a list of notable scripts in `package.json`, with brief descriptions.*

|-------------------|------------------------------------------------------------------|
| Name              | Description                                                      |
| `build-script`    | Build the scripts used in the `Application` directory.           |
| `build-scripts`   | Alias for `build-script`.                                        |
| `build-win`       | Run the `build` script for the `@sorrellwm/windows` sub-package. |
| `kill-electron`   | Kill any orphaned Electron processes.                            |
| `start-proper`    | This is the script launched by `Intermediate/Start.ts`           |
| `start`           | Builds `@sorrellwm/windows`, then starts the application.        |
| `start-electron`  | Identical to `start`, but does not build `@sorrellwm/windows`.   |

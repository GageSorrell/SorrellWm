# `@sorrell/wm`

This npm workspace is the Electron application foundation for SorrellWm. It uses
React and Effect in a Vite-powered renderer, a sandboxed preload bridge, and a
separate Electron main process.

## Development

Run commands from the monorepo root:

```powershell
npm run dev -w @sorrell/wm
npm run test -w @sorrell/wm
npm run lint -w @sorrell/wm
npm run typecheck -w @sorrell/wm
```

`dev` enables React Fast Refresh and rebuild/restart behavior for the Electron
main and preload processes. `dev:inspect` additionally opens the main-process
Node inspector on port 5858. `preview` builds and runs the production output.
The workspace compiler is pinned to TypeScript 6.0.2 and inherits the Effect
language-service and strict compiler defaults from
`Configuration/tsconfig.base.json`. `lint` runs ESLint 9 with
`Configuration/.eslintrc.cjs`, which extends `@sorrell/eslint-config`.

Create an unpacked application directory with `package`, or Windows installers
with `make`:

```powershell
npm run package -w @sorrell/wm
npm run make -w @sorrell/wm
npm run smoke:packaged -w @sorrell/wm
```

Generated files are written to `Application/Build` and `Application/Distribution`.
The smoke command launches the unpacked application without showing a window and
verifies the renderer-to-preload-to-main IPC path.

## Logs

The Electron main process routes its Effect logs through `@sorrell/log` to the
terminal and to a discoverable Windows named pipe. Start the application, then
open its Ink log viewer from another terminal:

```powershell
npm run logs -w @sorrell/wm
```

The client auto-discovers the running endpoint. SorrellWm uses named-pipe port
`43817` by default; set `SORRELL_WM_LOG_PORT` before starting the application
to override it, and connect explicitly with
`sorrell-log-client $env:SORRELL_WM_LOG_PORT` when more than one local log
producer is active.

The client receives retained global values when it connects, including the
application start time, current managed-window count, and active workspace
count. Global values are retained for seven days by the main-process logging
sink and are updated whenever the tiling state changes.

## Native modules

Install every native Node/Node-API package as a production dependency of this
workspace so that electron-builder can discover it:

```powershell
npm install -w @sorrell/wm your-native-module
npm run rebuild:native -w @sorrell/wm
```

The main-process build leaves production dependencies external. During
packaging, electron-builder rebuilds native dependencies for Electron's ABI and
the target architecture. The builder configuration explicitly unpacks `.node`
and `.dll` files from ASAR. `Source/Main/NativeModule.ts` provides a typed helper
for loading CommonJS or Node-API modules from the packaged application.

On Windows, compiling C++ addons requires Python and Visual Studio with the
Desktop development with C++ workload. Prefer Node-API for new addons when
possible because its ABI is more stable across Node and Electron upgrades.

Place runtime files that need to live outside ASAR in `Resource`; they are
copied beside the packaged application resources. Add platform-specific native
packages to `optionalDependencies` if installation should remain possible on
other operating systems.

## Process boundary

The renderer has no Node integration. Add privileged operations to the main
process and expose the smallest practical typed method through
`Source/Preload/Index.ts` and
`Source/Shared/ApplicationProgrammingInterface.ts`. Do not pass Electron
objects, native handles, or unrestricted IPC primitives into the renderer.

Tooling references:

- [electron-vite](https://electron-vite.org/guide/)
- [Electron native-code guide](https://www.electronjs.org/docs/latest/tutorial/native-code-and-electron)
- [electron-builder native-module troubleshooting](https://www.electron.build/docs/troubleshooting/)

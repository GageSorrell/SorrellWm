<span style="font-size: 12px;">Documentation for `SorrellWm`.<br />(c) 2026 Gage Sorrell.  Provided under the [MIT License](../../License.md).</span>

# Application Overview

**Purpose.**&ensp;This document describes the architecture, development workflow, and operating conventions of the SorrellWm desktop application. It is the starting point for developers working in the [`Application`](../../Application) workspace.

## Overview

The application is a Windows-focused Electron desktop application. Electron owns the application lifecycle and access to privileged operating-system functionality, React renders the user interface, Vite builds each JavaScript process, and Effect provides the foundation for typed application logic and managed side effects.

The workspace is intentionally divided into three security domains:

```text
React renderer
    │
    │ window.sorrell (typed, deliberately narrow API)
    ▼
Sandboxed preload
    │
    │ validated IPC messages
    ▼
Electron main process ──► native Node/Node-API modules ──► Windows API
```

The renderer must never import Node.js, Electron, or native modules. Privileged work belongs in the main process. The preload process is only a typed adapter between those two environments.

The versions in [`Application/package.json`](../../Application/package.json) are the source of truth. The initial foundation uses:

| Concern | Tool |
| --- | --- |
| Desktop runtime | Electron 43 |
| UI | React 19 |
| Application logic | Effect 4 beta |
| Language | TypeScript 6.0.2 |
| Development and bundling | electron-vite and Vite |
| Unit/component tests | Vitest, Testing Library, and jsdom |
| Linting | ESLint 9 with `@sorrell/eslint-config` |
| Packaging | electron-builder |

## Workspace Layout

The authored files are organized as follows:

```text
Application/
├── Source/
│   ├── Main/                 Electron lifecycle, windows, IPC, native modules
│   ├── Preload/              Context-isolated renderer bridge
│   ├── Renderer/             React application, styles, and renderer tests
│   └── Shared/               Types and constants shared across processes
├── Resource/                 Files copied outside app.asar at package time
├── Script/                   Packaged-application smoke tests
├── electron.vite.config.ts   Build configuration for all three processes
├── electron-builder.yml      Windows packaging and native-module configuration
├── tsconfig.node.json        Main, preload, and tooling TypeScript project
├── tsconfig.web.json         Renderer TypeScript project
└── vitest.config.ts          Renderer test configuration
```

Generated output is not source code:

- `Application/Build` contains the electron-vite production build.
- `Application/Distribution` contains unpacked applications and installers from electron-builder.
- `*.tsbuildinfo` files contain TypeScript incremental-build state.

Do not edit generated files. Recreate them with the scripts described below.

## Runtime Architecture

### Main Process

[`Source/Main/Index.ts`](../../Application/Source/Main/Index.ts) is the Electron entry point. It is responsible for:

- waiting for Electron to become ready;
- registering the production renderer protocol;
- creating and restoring application windows;
- defining IPC handlers;
- opening approved external HTTPS links;
- observing renderer and preload failures; and
- shutting down according to the host platform's conventions.

The main window is created with `contextIsolation: true`, `sandbox: true`, and `nodeIntegration: false`. These settings are security invariants and must not be relaxed to make a renderer feature easier to implement.

During development, electron-vite supplies `ELECTRON_RENDERER_URL`, and the window loads the Vite development server. This provides React Fast Refresh while electron-vite rebuilds and restarts the main or preload process when their source changes.

Production content is loaded from `sorrell://app/Index.html`. The `sorrell` scheme is registered as a secure, standard protocol, and its handler serves only files beneath `Build/Renderer`. The handler rejects path traversal. This avoids granting Electron's `file://` protocol additional privileges while still allowing normal relative asset URLs.

Do not use top-level `await` to wait for `app.whenReady()`. Electron completes main-module evaluation as part of startup, so waiting at module scope can deadlock application readiness. Attach a continuation to the readiness promise as the current entry point does.

### Preload Process

[`Source/Preload/Index.ts`](../../Application/Source/Preload/Index.ts) runs in a sandboxed, context-isolated environment. electron-vite emits it as a self-contained CommonJS bundle because sandboxed preload scripts cannot depend on arbitrary external Node modules.

The preload exposes an immutable `window.sorrell` object with `contextBridge.exposeInMainWorld`. It may expose small, task-oriented functions such as `ping()`. It must not expose `ipcRenderer`, Electron event objects, native handles, filesystem access, or generic message-sending functions.

Every value received from IPC is `unknown` until it has been validated. The existing `ping()` implementation demonstrates this by checking the main process response before returning it to the renderer.

### Renderer Process

[`Source/Renderer`](../../Application/Source/Renderer) is an ordinary Vite-powered React application. It has DOM APIs but no Node or Electron privileges. React components access privileged features only through the typed `window.sorrell` API declared in [`ApplicationProgrammingInterface.d.ts`](../../Application/Source/Renderer/Source/ApplicationProgrammingInterface.d.ts).

The renderer HTML defines a restrictive Content Security Policy. New functionality should work within that policy. Avoid inline scripts, remote code, unsafe dynamic evaluation, and direct filesystem URLs.

The current [`Application.tsx`](../../Application/Source/Renderer/Source/Application.tsx) is a connection test rather than the intended final interface. It proves that React renders, Effect v4 executes, runtime metadata crosses the preload boundary, and renderer-to-main IPC works.

### Shared Contracts

[`Source/Shared/ApplicationProgrammingInterface.ts`](../../Application/Source/Shared/ApplicationProgrammingInterface.ts) is compiled into both the Node and renderer projects. It defines IPC channel constants and the public TypeScript shape of the preload API.

When adding a privileged feature:

1. Define its narrow request/response contract in `Source/Shared`.
2. Implement the operation and register its IPC handler in `Source/Main`.
3. Validate the IPC sender and all untrusted inputs where appropriate.
4. Add a typed wrapper to the object exposed by `Source/Preload/Index.ts`.
5. Add the same member to `IApplicationApi`.
6. Mock the member in `Source/Renderer/Source/Test/Setup.ts`.
7. Consume only that wrapper from React.

Prefer domain-specific methods such as `listWindows()` or `focusWindow(id)` over generic methods such as `invoke(channel, payload)`.

## Effect v4

The workspace is pinned to the current selected Effect v4 beta rather than a range. Imports should normally come from the package root:

```ts
import { Effect } from "effect";
```

Effect is intended to model fallible and asynchronous application logic, dependencies, resource lifetimes, concurrency, and retries. It does not change the Electron security model: an Effect running in the renderer still cannot perform privileged work. Windows integration Effects therefore belong in the main process and should be exposed through typed IPC operations.

Keep Effect descriptions separate from execution where practical. Build reusable values first, provide their requirements at an application boundary, and run them from an Electron lifecycle or IPC handler. React components should generally receive plain values or call a small adapter rather than becoming responsible for long-lived Effect runtimes.

The main process applies that lifecycle rule to native input services:

- [`WindowsMessageLoop.ts`](../../Application/Source/Main/WindowsMessageLoop.ts) is a scoped layer. Acquiring it starts the dedicated Win32 message loop and exposes its thread identifier; releasing it stops and joins the loop.
- [`Keyboard.ts`](../../Application/Source/Main/Keyboard.ts) depends on that layer and exposes `Events()`. Each call creates a scoped Effect containing a `Stream` of every keyboard event. Closing the scope unsubscribes the native callback and shuts down its queue.
- [`Hotkey.ts`](../../Application/Source/Main/Hotkey.ts) consumes that complete event stream, tracks held keys, and compares each key-down with its configured keybinds. A keybind contains one trigger key and exact `Control`, `Alt`, `Shift`, and `Super` requirements. Matches are broadcast through the service's `Matches` stream for a `HotkeyMatcher` layer to consume.
- [`Index.ts`](../../Application/Source/Main/Index.ts) owns one `ManagedRuntime`. It first evaluates the runtime after `app.whenReady()` and disposes it during `before-quit`, before allowing Electron to finish quitting.

Native callbacks only enqueue event values. Application behavior consumes the resulting stream in an Effect fiber, so failures, interruption, and listener lifetimes stay explicit. A feature can subscribe as follows:

```ts
import { Keyboard as NativeKeyboard, VK } from "@sorrell/windows";
import { Effect, Stream } from "effect";
import { Keyboard } from "./Keyboard.js";

const WatchF24 = Effect.gen(function*()
{
    const Service = yield* Keyboard;
    const Events = yield* Service.Events();

    yield* Events.pipe(
        Stream.filter((Event) =>
            Event.Key === VK.F24
                && NativeKeyboard.State.$is("Down")(Event.State)
        ),
        Stream.runForEach((Event) =>
            Effect.log(`F24 scan code: ${ Event.ScanCode }`)
        )
    );
}).pipe(Effect.scoped);
```

Hotkey actions remain separate from detection. A future matcher can consume the
already-matched application actions without maintaining keyboard state itself:

```ts
import { Effect, Stream } from "effect";
import { Hotkey } from "./Hotkey.js";

const RunHotkeyMatcher = Effect.gen(function*()
{
    const Service = yield* Hotkey;

    yield* Service.Matches.pipe(
        Stream.runForEach((Match) =>
            Effect.log(`Matched hotkey action: ${ Match.Keybind.Id }`)
        )
    );
});
```

Run a long-lived consumer with `Effect.forkScoped` from another application layer, or run it through the managed runtime when the feature should have an explicitly shorter lifetime. Do not call `MessageLoop.Start`, `MessageLoop.Stop`, `Keyboard.Subscribe`, or `Keyboard.Unsubscribe` directly from application features; those are implementation details of the Effect layers.

Effect v4 is beta software and may contain breaking API changes between releases. Treat upgrades as migrations: pin an exact version, consult the v4 migration material, run every validation command, and review the packaged application before changing the lockfile.

## TypeScript Configuration

The application uses TypeScript project references so the Node and browser environments are checked independently:

- [`tsconfig.node.json`](../../Application/tsconfig.node.json) checks Electron main code, preload code, shared contracts, and build/test configuration. It uses NodeNext module semantics.
- [`tsconfig.web.json`](../../Application/tsconfig.web.json) checks the React renderer and shared contracts. It uses `module: "Preserve"` with Bundler resolution because Vite performs the transformation.
- [`tsconfig.json`](../../Application/tsconfig.json) references both projects for editor and build-tool discovery.

Both projects extend [`Configuration/tsconfig.base.json`](../../Configuration/tsconfig.base.json). The base config supplies the strict Effect-oriented defaults, incremental/composite checking, source and declaration maps, verbatim module syntax, relative import rewriting, and the `@effect/language-service` plugin.

Editors must use the TypeScript installation from the workspace for the Effect language-service plugin to load. The repository pins TypeScript 6.0.2. Do not silently switch an editor to its bundled TypeScript version when investigating diagnostics.

Relative imports in NodeNext code use the emitted `.js` extension even when the source file is `.ts`:

```ts
import { ApplicationIpcChannel } from "../Shared/ApplicationProgrammingInterface.js";
```

## Development Workflow

Use Node and npm versions compatible with the root `package.json`; `.nvmrc` currently selects Node 26.5.0. Install dependencies from the monorepo root so npm can resolve all workspaces:

```powershell
npm install
```

Run application scripts either by package name or workspace path. The package name is preferred in documentation:

| Command | Purpose |
| --- | --- |
| `npm run dev -w @sorrell/wm` | Start Electron and the Vite development server with watch mode and React Fast Refresh. |
| `npm run dev:inspect -w @sorrell/wm` | Start development mode and expose the main-process inspector on port 5858. |
| `npm run lint -w @sorrell/wm` | Run ESLint with `Configuration/.eslintrc.cjs` and `@sorrell/eslint-config`. |
| `npm run typecheck -w @sorrell/wm` | Check both TypeScript projects without emitting files. |
| `npm run test -w @sorrell/wm` | Run the Vitest suite once. |
| `npm run test:watch -w @sorrell/wm` | Run Vitest interactively in watch mode. |
| `npm run build -w @sorrell/wm` | Type-check and build main, preload, and renderer output into `Application/Build`. |
| `npm run preview -w @sorrell/wm` | Run the existing production build through electron-vite preview. Build first if output is absent or stale. |
| `npm run package -w @sorrell/wm` | Build and create an unpacked application in `Application/Distribution`. |
| `npm run make -w @sorrell/wm` | Build distributable Windows installers with electron-builder. |
| `npm run smoke:packaged -w @sorrell/wm` | Launch the unpacked application invisibly and verify renderer, preload, and main-process IPC. |
| `npm run rebuild:native -w @sorrell/wm` | Rebuild installed native dependencies for Electron's ABI. |

A normal change should pass lint, type checking, and relevant tests. Changes to process boundaries, build configuration, dependencies, Electron startup, preload code, or native modules should also pass `build`, `package`, and `smoke:packaged`.

## Testing

Vitest discovers PascalCase `*Test.ts` and `*Test.tsx` files and runs renderer tests in jsdom. [`vitest.config.ts`](../../Application/vitest.config.ts) loads [`Source/Renderer/Source/Test/Setup.ts`](../../Application/Source/Renderer/Source/Test/Setup.ts), which installs Testing Library matchers and provides a test implementation of `window.sorrell`.

Component tests should exercise behavior through the same public bridge that production components use. Update the shared test bridge whenever `IApplicationApi` changes. Main-process and native integration tests should be kept separate from jsdom tests because jsdom does not implement Electron or Windows APIs.

The packaged smoke test is intentionally small but crosses the complete boundary:

```text
packaged renderer → window.sorrell.ping() → preload IPC → main handler → "pong"
```

It also fails when the renderer cannot load. Use it to catch ASAR paths, preload bundling, protocol registration, Electron startup, and IPC exposure regressions that unit tests cannot detect.

## Native Windows Modules

Native Windows integration will run in the Electron main process. Prefer Node-API when authoring new C++ addons because it provides a more stable ABI than direct V8 bindings.

Install runtime native packages as production dependencies of `@sorrell/wm`:

```powershell
npm install -w @sorrell/wm your-native-module
npm run rebuild:native -w @sorrell/wm
```

Do not install a runtime native package only as a development dependency. electron-builder discovers production dependencies, rebuilds them for the selected Electron version and target architecture, and copies them into the packaged application.

[`electron-builder.yml`](../../Application/electron-builder.yml) currently:

- runs Electron's native dependency rebuild in parallel;
- packages application code into `app.asar`;
- unpacks `.node` and `.dll` files so the operating system can load them;
- copies `Application/Resource` beside the packaged application resources;
- produces NSIS targets for Windows x64 and ARM64; and
- applies hardened Electron fuses.

Use [`loadNativeModule`](../../Application/Source/Main/NativeModule.ts) when a CommonJS or Node-API package must be loaded from ESM main-process code. Platform-specific packages may be placed in `optionalDependencies` when developers on other operating systems must still be able to install the workspace.

Building C++ modules on Windows normally requires Python and Visual Studio with the **Desktop development with C++** workload. A module must be rebuilt separately for each Electron ABI and processor architecture that the application ships.

## Packaging and Security

The production build contains only `Build`, `package.json`, selected resources, and discovered production dependencies. Source maps are generated for local builds but excluded from the packaged application.

The package uses the following important Electron fuses:

- `ELECTRON_RUN_AS_NODE` is disabled;
- `NODE_OPTIONS` and command-line inspector arguments are disabled;
- cookie encryption is enabled;
- embedded ASAR integrity validation is enabled;
- application code may load only from `app.asar`; and
- additional `file://` privileges are disabled.

The application currently opens external windows only when their URL begins with `https://`, and always denies Electron from creating the requested child window. As features are added, prefer explicit allowlists and validate the final parsed URL rather than broad string matching.

Never place secrets in renderer code or Vite environment variables that are bundled into renderer code. Treat the renderer as web content that could be compromised. Validate IPC inputs and senders before allowing filesystem, process, window-management, or native operations.

## Adding a Feature

Use this sequence for a typical feature that needs Windows integration:

1. Model the operation and its errors with Effect in `Source/Main`.
2. Add serializable request and response types to `Source/Shared`.
3. Implement a narrow, validated IPC handler in the main process.
4. Expose a wrapper through the preload API.
5. Update the renderer global declaration and test bridge.
6. Build the React UI against the preload wrapper.
7. Add renderer tests and main-process tests at the appropriate boundary.
8. Run lint, type checking, tests, build, package, and the packaged smoke test.

Keep IPC values structured-clone compatible. Do not attempt to transfer Effects, functions, Electron objects, C++ pointers, or native window handles directly into the renderer. Convert native results into explicit data-transfer objects first.

## Current Foundation and Expected Growth

The current code is deliberately small. It establishes the build, security, testing, and packaging boundaries; it does not yet implement a window manager. Developers should expect to add:

- Effect services and layers for Windows window discovery and commands;
- typed IPC endpoints for those services;
- React state and views for layouts, workspaces, and configuration;
- unit and integration coverage for main-process logic;
- one or more native Node-API packages;
- application icons, signing configuration, and release metadata; and
- installer/update policy appropriate for distribution.

Preserve the existing boundaries while growing these areas. The central rule is simple: React presents data, preload exposes a narrow contract, main owns authority, and native code is never directly reachable from web content.

## Related Files

- [`Application/ReadMe.md`](../../Application/ReadMe.md) provides a concise command and native-module reference.
- [`Configuration/tsconfig.base.json`](../../Configuration/tsconfig.base.json) defines the shared TypeScript and Effect defaults.
- [`Configuration/.eslintrc.cjs`](../../Configuration/.eslintrc.cjs) selects the monorepo ESLint configuration.
- [`electron.vite.config.ts`](../../Application/electron.vite.config.ts) defines process-specific builds.
- [`electron-builder.yml`](../../Application/electron-builder.yml) defines packaged application contents and targets.

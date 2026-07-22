# `@sorrell/app-settings`

Schema-validated, JSON-file-backed application settings for Effect.

The package constructs a typed service from an Effect schema. By default it selects the native
per-user configuration directory for `process.platform` and creates the directory tree when
needed. Successful changes are written atomically before the in-memory value is committed, and
a scoped file watcher publishes valid external changes to the application.

## Usage

```ts
import { NodeServices } from "@effect/platform-node";
import { Effect, Layer, Schema, Stream } from "effect";
import { AppSettings } from "@sorrell/app-settings";

const SettingsSchema = Schema.Struct({
    launchAtStartup: Schema.Boolean,
    theme: Schema.String
});

const Settings = AppSettings.make(
    SettingsSchema,
    {
        initial: {
            launchAtStartup: false,
            theme: "system"
        }
    }
);

const Live = Settings.layer.pipe(Layer.provide(NodeServices.layer));

const Program = Effect.gen(function*()
{
    const Service = yield* Settings;

    const Theme = yield* Service.getSetting("theme");
    yield* Effect.log(`Current theme: ${ Theme }`);

    yield* Service.setSetting("theme", "dark");

    // `changes` immediately emits the current value, then every update made
    // through the service or loaded from an external file edit.
    yield* Service.changes.pipe(
        Stream.runForEach((Value) => Effect.log("Settings changed", Value)),
        Effect.forkScoped
    );
});

Effect.runPromise(Effect.scoped(Program).pipe(Effect.provide(Live)));
```

The layer requires Effect's `FileSystem` and `Path` services. A Node application can provide
both with `NodeServices.layer`; other runtimes can supply their corresponding platform layer.

## Default path

With the default application name `SorrellWm` and filename `settings.json`, the path is:

| Platform | Path |
| --- | --- |
| Windows | `%APPDATA%\SorrellWm\settings.json` |
| macOS | `~/Library/Application Support/SorrellWm/settings.json` |
| Linux and other Unix platforms | `$XDG_CONFIG_HOME/SorrellWm/settings.json`, or `~/.config/SorrellWm/settings.json` |

`applicationName` and `fileName` customize the final two components:

```ts
const Settings = AppSettings.make(SettingsSchema, {
    applicationName: "MyApplication",
    fileName: "preferences.json"
});
```

A completely custom path can be supplied with `filePath`:

```ts
const Settings = AppSettings.make(SettingsSchema, {
    filePath: "./configuration/settings.json"
});
```

The previous positional form, `AppSettings.make(schema, filePath, options)`, remains supported.

## External state synchronization

Use `synchronize` when one or more settings also control state outside the JSON file, such as
registering the application to run when the user signs in:

```ts
declare const SynchronizeExternalState: (
    Settings: Schema.Schema.Type<typeof SettingsSchema>
) => Effect.Effect<void, Error>;

const Settings = AppSettings.make(SettingsSchema, {
    initial: {
        launchAtStartup: false,
        theme: "system"
    },
    synchronize: SynchronizeExternalState
});
```

Candidate settings are schema-validated and serialized before `synchronize` runs. For updates
made through `set`, `setSetting`, or `update`, the commit order is:

1. Run `synchronize` with the complete candidate settings value.
2. Atomically replace the JSON file.
3. Publish the new in-memory value through `get` and `changes`.

If synchronization fails, the operation fails with `AppSettings.SynchronizationError`; the JSON
file and in-memory settings remain unchanged. The original failure is available as the error's
`cause`.

The hook also runs when the layer initializes, allowing saved settings to be reconciled with
external state before the service becomes available. Valid external file edits run through the
hook before entering memory. Because such an edit was made outside this package, a failed hook
cannot undo the external file write; it keeps the previous in-memory settings instead.

## Service API

| Member | Behavior |
| --- | --- |
| `get` | Retrieves the complete current settings value. |
| `getSetting(key)` | Retrieves one setting with its schema-derived type. |
| `set(value)` | Validates, atomically persists, and replaces all settings. |
| `setSetting(key, value)` | Validates, atomically persists, and replaces one setting. |
| `update(f)` | Computes and persists a complete replacement value. |
| `changes` | Replays the current value and broadcasts subsequent local and external updates. |

## File and failure behavior

- Existing files are parsed as JSON and decoded with the supplied schema when the layer starts.
- If the file does not exist, `initial` is persisted. When `initial` is omitted, an empty object
  is decoded so defaults defined by the schema can provide the initial settings.
- Missing parent directories are created recursively before the file is loaded or written.
- When `synchronize` is provided, its successful completion is required before a file is created
  or replaced and before a value is published in memory.
- Writes use a temporary file in the same directory followed by an atomic replacement. The
  service's in-memory value and `changes` stream are updated only after that replacement succeeds.
- A failed write returns `AppSettings.WriteError` and leaves the last committed in-memory value
  unchanged.
- Invalid external JSON or schema-invalid external values are logged and ignored. The last valid
  value remains active, and monitoring continues.
- A failed watcher is logged and restarted after `watchRetryDelay` (one second by default).

`AppSettings.make` also accepts `applicationName`, `fileName`, `filePath`, `jsonSpace`,
`synchronize`, `watchDebounce`, and `watchRetryDelay` options. The returned tag retains the
inferred settings type, its `.schema`, its resolved `.filePath`, and its scoped `.layer`.

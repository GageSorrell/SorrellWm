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

Settings are the durable description of desired state. Use a downstream synchronization layer
when settings also control state outside the JSON file, such as registering the application to
run when the user signs in:

```ts
const Settings = AppSettings.make(SettingsSchema, {
    initial: {
        launchAtStartup: false,
        theme: "system"
    }
});

declare const SynchronizeLaunchAtStartup: (
    Enabled: boolean
) => Effect.Effect<void, Error, StartupRegistration>;

const SynchronizationLive = AppSettings.synchronizeSetting(
    Settings,
    "launchAtStartup",
    SynchronizeLaunchAtStartup
);

const Live = SynchronizationLive.pipe(
    Layer.provideMerge(Settings.layer),
    Layer.provide(NodeServices.layer),
    Layer.provide(StartupRegistrationLive)
);
```

`synchronizeSetting` immediately applies the current committed value, then applies later changes
to that setting. Changes to unrelated settings are ignored using `Object.is` equality. The
synchronizer's Effect requirements are retained by the returned layer, so it may depend on
services that themselves use `Settings` without creating a construction cycle.

`synchronize(Settings, Reconcile)` provides the same behavior for the complete settings value.
Failures are logged and do not terminate monitoring; the committed settings remain the desired
state and later changes are still processed. A reconciler can apply its own retry policy with
`Effect.retry` when external failures are transient.

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
- Writes use a temporary file in the same directory followed by an atomic replacement. The
  service's in-memory value and `changes` stream are updated only after that replacement succeeds.
- A failed write returns `AppSettings.WriteError` and leaves the last committed in-memory value
  unchanged.
- Invalid external JSON or schema-invalid external values are logged and ignored. The last valid
  value remains active, and monitoring continues.
- A failed watcher is logged and restarted after `watchRetryDelay` (one second by default).

`AppSettings.make` also accepts `applicationName`, `fileName`, `filePath`, `jsonSpace`,
`watchDebounce`, and `watchRetryDelay` options. The returned tag retains the inferred settings
type, its `.schema`, its resolved `.filePath`, and its scoped `.layer`.

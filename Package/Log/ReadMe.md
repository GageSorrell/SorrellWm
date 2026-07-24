# `@sorrell/log`

Effect-first structured logging for Node, Electron, browsers, React, and
`node-addon-api` modules. A record is filtered before expensive normalization,
normalized once into the version-one JSON-safe schema, then delivered in order
to every configured sink. Sink failures are isolated and reported through a
rate-limited fallback that never re-enters the logging pipeline.

## Effect setup

```ts
import { Effect } from "effect";
import * as Logging from "@sorrell/log/Effect";
import * as ConsoleSink from "@sorrell/log/Node/ConsoleSink";
import * as FileSink from "@sorrell/log/Node/FileSink";

const LoggingLayer = Logging.Layer({
    Application: {
        Name: "Sorrell Window Manager",
        Version: "0.1.0"
    },
    DefaultCategory: "Application",
    MinimumLevel: "Info",
    CategoryMinimumLevels: {
        "Application.WindowManager": "Debug",
        "Application.Native": "Warn"
    },
    Sinks: [
        ConsoleSink.Pretty({ ColorMode: "Auto" }),
        FileSink.JsonLines({
            Path: "./logs/application.ndjson",
            MaximumFileSizeBytes: 10_000_000,
            MaximumRetainedFiles: 5
        })
    ]
});

const Program = Effect.gen(function*()
{
    yield* Effect.logInfo("Starting application");
    yield* Effect.logDebug("Discovering windows");
}).pipe(
    Logging.WithCategory("WindowManager.Discovery"),
    Effect.provide(LoggingLayer)
);
```

The integration uses the installed Effect v4 public API. In beta.101,
`Logger.layer` installs the adapter, while annotations and spans are available
from `References.CurrentLogAnnotations` and `CurrentLogSpans` through the
logger's fiber. `Logging.Layer` also installs the least restrictive effective
minimum level needed by category overrides; the package runtime performs the
final longest-prefix category filter. `All` and `None` remain configuration
sentinels and are never emitted as record severities.

## Structured values and redaction

```ts
import { Redacted } from "@sorrell/log";
import * as Loggable from "@sorrell/log/Loggable";

class Rectangle implements Loggable.Loggable
{
    public readonly [Loggable.TypeId] = (
        Context: Loggable.LoggableContext
    ): unknown => ({
        Type: "Rectangle",
        Width: 100,
        Height: 50,
        Token: Context.Redacted("Token")
    });
}

Logger.Info("Created", new Rectangle(), {
    Credential: Redacted(secret, "Credential")
});
```

Configured redacted annotation keys are matched case-insensitively. The
underlying value is never retained in `LogRecord`. Getters are not invoked by
default, and protocol, proxy, formatter, and sink defects are contained.

## Tracked global values

`MakeGlobal` creates a typed, Schema-like descriptor whose string key uniquely
identifies one current value. `LogGlobal` emits the update through the active
Effect runtime:

```ts
import { DateTime, Effect } from "effect";
import {
    LogGlobal,
    MakeGlobal
} from "@sorrell/log";

const WorkItems = MakeGlobal("work-items", {
    Name: "Work items",
    Type: "Integer",
    MinimumValue: 0,
    MaximumValue: 100
});

const LastRefresh = MakeGlobal("last-refresh", {
    Name: "Last refresh",
    Type: "DateTime",
    DisplayTimeSince: true
});

const Program = Effect.gen(function*()
{
    yield* LogGlobal(WorkItems, 42);
    yield* LogGlobal(LastRefresh, DateTime.nowUnsafe());
}).pipe(Effect.provide(LoggingLayer));
```

Descriptors support `Boolean`, `DateTime`, `Integer`, `Number`, `String`, and
general normalized `Value` types. Numeric ranges are validated when logged.
DateTime globals accept Effect `DateTime` values and valid JavaScript `Date`
objects.

Each emitted `LogRecord` contains a structured `Global` field as well as a
normal message containing `Name = Value`, so console and file output remain
readable and the NDJSON record retains the complete global definition.

## Direct JavaScript

```ts
import { MakeLogger } from "@sorrell/log";

const Logger = MakeLogger(Runtime, "Application.Electron");
Logger.Info("Window discovered", { WindowHandle: "0x000A1234" });
Logger.Child("Layout").Error("Could not reposition window", {
    WindowsErrorCode: 5
});
```

Direct methods are synchronous, nonblocking, best effort, and return `void`.
They do not automatically inherit Effect fibers, spans, causes, interruption,
typed backpressure, or scope-guaranteed flushing. Run `Runtime.Flush` or
`Runtime.Shutdown` through Effect during application shutdown when delivery
guarantees matter. No global singleton is installed.

## React

```tsx
import {
    LogErrorBoundary,
    LogProvider,
    useLogger
} from "@sorrell/log/React";

function SaveButton()
{
    const Logger = useLogger("Settings");
    return <button onClick={() => Logger.Info("Saving settings")}>Save</button>;
}

function Root()
{
    return (
        <LogProvider Runtime={Runtime} Category="Renderer">
            <LogErrorBoundary Fallback={<div>Application crashed</div>}>
                <SaveButton />
            </LogErrorBoundary>
        </LogProvider>
    );
}
```

Nested providers append categories and merge annotations. The React entrypoint
imports no Node, Electron, file, transport, or native code. Logging during
render is discouraged; `useLogLifecycle` is opt-in.

## Electron forwarding

The root package provides an Electron-free callback sink:

```ts
import { ForwardSink } from "@sorrell/log";

const Sink = ForwardSink.Make({
    MaximumBatchSize: 100,
    FlushInterval: "50 millis",
    Send: (Records) => window.logs.Send(Records)
});
```

The main process should call `Forward.Receive` for each incoming record. It
validates schema version, level, category, sizes, collections, and nested
values; marks the new source as `Forwarded`; preserves original source/process
metadata in reserved annotations; and replaces process metadata with an
authoritative main-process value. Version-one Hello, Log, Dropped, and Goodbye
NDJSON messages are shared with the local named-pipe client.

## Live Windows client

Applications can expose their normalized log stream through a numbered Windows
named pipe. The configured port becomes
`\\.\pipe\sorrell-log-v1-<port>`.

```ts
import * as Logging from "@sorrell/log/Effect";
import * as NamedPipeSink from "@sorrell/log/Node/NamedPipeSink";

const Application = {
    Name: "Sorrell Window Manager",
    Version: "0.1.0"
};

const LoggingLayer = Logging.Layer({
    Application,
    Sinks: [
        NamedPipeSink.Make({
            Application,
            GlobalRetention: "7 days",
            Port: 4317,
            Process: {
                ProcessIdentifier: process.pid,
                ProcessType: "ElectronMain"
            }
        })
    ]
});
```

The sink starts its server immediately, retains a bounded recent-record buffer,
and accepts multiple viewers. `MaximumBufferedRecords` and
`MaximumClientBufferBytes` bound application memory when no viewer is present
or a viewer is slow. The current value for every global key is retained for the
configurable `GlobalRetention` Effect duration and sent as an authoritative
snapshot whenever a viewer connects. The default retention is seven days.
Runtime shutdown emits a Goodbye message and closes the pipe. Use
`@sorrell/log-client` to discover or connect to the stream.

## Native addons

Consumers provide `node-addon-api`; ordinary JavaScript users do not install it
through this package.

```ts
import * as Native from "@sorrell/log/Native";

const Callback = Native.CreateCallback(Runtime, {
    DefaultCategory: "Native"
});
const IncludeDirectory = Native.GetIncludeDirectory();
```

```cpp
#include <sorrell/log.hpp>

auto Logger = Sorrell::Log::Bridge::Create(
    Environment,
    JavaScriptCallback,
    {
        .MaximumQueueSize = 1024,
        .DefaultCategory = "Native"
    }
);

Logger.Info(
    "Windows.Hotkeys",
    "Registered global hotkey",
    {
        Sorrell::Log::Field("VirtualKey", std::uint64_t{65}),
        Sorrell::Log::WindowsErrorCode(GetLastError())
    }
);
```

The bridge requires C++20. Worker threads only construct ordinary C++ values.
They enqueue with bounded `NonBlockingCall`; all `Napi::Value` construction
occurs in the JavaScript-thread callback. Stop and join producer threads before
`Close` or destruction. `Close` is idempotent, waits for in-flight native calls,
then makes `Release()` the final thread-safe-function operation.

## Entrypoints

- `@sorrell/log` — browser-safe model, normalization, direct logger, and
  forwarding.
- `@sorrell/log/Effect` — scoped runtime and Effect adapter.
- `@sorrell/log/Global` — typed global descriptors and update operation.
- `@sorrell/log/React` — provider, hooks, and error boundary.
- `@sorrell/log/Node` — formatters, metadata, console, and file sinks.
- `@sorrell/log/Node/NamedPipeSink` — configurable Windows live-log pipe.
- `@sorrell/log/Native` — native validation, callback, lifecycle, and includes.
- `@sorrell/log/Testing` — in-memory sink and deterministic assertions.

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for milestone and Effect
API adaptation details.
